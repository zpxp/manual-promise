// for some reason we cannot override promise in typesecript, so move this code into a js file and create a .d.ts file
// bug https://github.com/Microsoft/TypeScript/issues/15397

/**
 * a promise that can be resolved/rejected from outside itself IE: promise.Resolve()
 */
class ManualPromise extends Promise {
	_promiseResolve = null;
	_promiseReject = null;

	resolve(value) {
		this._promiseResolve(value);
		this._promiseResolve = () => null; //noop;
		this.done = true;
		return this;
	}

	reject(reason) {
		// super.catch(x => x);
		this._promiseReject(reason);
		this._promiseReject = () => null; //noop;
		this.done = true;
		return this;
	}

	get _superThen() {
		return super.then;
	}
	get _superCatch() {
		return super.catch;
	}

	constructor(arg) {
		super(arg);
		this.reject = this.reject.bind(this);
		this.resolve = this.resolve.bind(this);
	}
}

// since we cannot access this inside the function passed to super(), we need to 'wrap' the prototype
// with this function store the resolve and reject function inside a temp object so we can then
// assign them to the prom object
const originalCtor = ManualPromise.prototype.constructor;
const oldProto = ManualPromise.prototype;

ManualPromise = function(action) {
	let temp = {};

	// assign resolve and reject to temp object then put them on the instance after its initial construction
	let prom = new originalCtor((resolve, reject) => {
		temp._promiseResolve = resolve;
		temp._promiseReject = reject;
	});

	prom._promiseResolve = temp._promiseResolve;
	prom._promiseReject = temp._promiseReject;

	// then and catch would return a regular Promise. Override them to return a manual promise instead
	prom.then = function() {
		const prom2 = new ManualPromise();
		this._superThen.apply(this, arguments).then(
			function() {
				prom2.resolve.apply(prom2, arguments);
			},
			function() {
				prom2.reject.apply(prom2, arguments);
			}
		);

		return prom2;
	};

	prom.catch = function() {
		const prom2 = new ManualPromise();
		this._superCatch.apply(this, arguments).then(function() {
			prom2.reject.apply(prom2, arguments);
		});

		// prevent throwing error
		return prom2._superCatch(x => x);
	};

	// now run passed in action
	if (action) {
		prom.running = true;
		action(
			function() {
				prom.running = false;
				prom._promiseResolve.apply(prom, arguments);
			},
			function() {
				prom.running = false;
				prom._promiseReject.apply(prom, arguments);
			}
		);
	}

	return prom;
};

oldProto.constructor = ManualPromise.prototype.constructor;
//proto switcheroo
ManualPromise.prototype = oldProto;


//static funcs
ManualPromise.resolve = function resolve(data) {
	const prom = new ManualPromise();
	prom.resolve(data);
	return prom;
};

ManualPromise.reject = function reject(data) {
	const prom = new ManualPromise();
	prom.reject(data);
	return prom;
};

// assign a single instance to window then export that instance. this is so `instanceof` will always work if multiple
// copies of the lib exist in node_modules
if (!window.ManualPromise) {
	window.ManualPromise = ManualPromise;
}

export default window.ManualPromise;
