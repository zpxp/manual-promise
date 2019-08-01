import { ManualPromise } from "../index";

describe("manual promise", () => {
	test("Should resolve", () => {
		expect(ManualPromise).toEqual(expect.anything());
	});

	test("Funcs", () => {
		const prom = new ManualPromise();

		expect(typeof prom.resolve).toEqual("function");
		expect(typeof prom.reject).toEqual("function");
		expect(typeof ManualPromise.resolve).toEqual("function");
		expect(typeof ManualPromise.reject).toEqual("function");
	});

	test("Resolve", () => {
		return new Promise(resolve => {
			const prom = new ManualPromise();

			const mock = jest.fn();

			expect(prom.then(mock) instanceof ManualPromise).toEqual(true);

			prom.resolve(33);

			setTimeout(() => {
				expect(mock).toBeCalled();
				expect(mock.mock.calls[0][0]).toEqual(33);
				resolve();
			}, 1);
		});
	});

	test("Reject", () => {
		return new Promise(resolve => {
			const prom = new ManualPromise();

			const mock = jest.fn();

			expect(prom.catch(mock) instanceof ManualPromise).toEqual(true);

			prom.reject(33);

			setTimeout(() => {
				expect(mock).toBeCalled();
				expect(mock.mock.calls[0][0]).toEqual(33);
				resolve();
			}, 1);
		});
	});
});
