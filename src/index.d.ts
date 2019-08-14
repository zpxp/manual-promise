/**
 * A promise that can be resolved/rejected from outside itself IE: promise.resolve()
 */
declare class ManualPromise<T = any> extends Promise<T> {
	/** Is the passed action currently running? N/A if no action was passed in the ctor */
	readonly running: boolean;
	/** `true` once this promise has been resolved or rejected */
	readonly done: boolean;

	/** Resolve the promise with optional argument */
	resolve(value?: T | PromiseLike<T>): ManualPromise<T>;

	/** Returns a resolved instance of `ManualPromise` */
	static resolve<T>(value?: T): ManualPromise<T>;

	/** Resolve the promise with optional argument */
	reject(reason?: any): ManualPromise<T>;

	/** Returns a rejected instance of `ManualPromise` */
	static reject(reason?: any): ManualPromise<never>;

	/**
	 * Attaches callbacks for the resolution and/or rejection of the Promise.
	 * @param onfulfilled The callback to execute when the Promise is resolved.
	 * @param onrejected The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of which ever callback is executed.
	 */
	then<TResult1 = T, TResult2 = never>(
		onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
		onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
	): ManualPromise<TResult1 | TResult2>;

	/**
	 * Attaches a callback for only the rejection of the Promise.
	 * @param onrejected The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of the callback.
	 */
	catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): ManualPromise<T | TResult>;

	constructor();
	constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void);
}

export default ManualPromise;