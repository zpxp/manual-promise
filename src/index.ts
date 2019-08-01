import _ManualPromise from "./promise";

export const ManualPromise = _ManualPromise;


interface Window {
	ManualPromise: typeof ManualPromise
}