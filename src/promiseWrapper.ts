import { type PromiseWrapper } from './useSSE.type';

export const promiseWrapper: PromiseWrapper = (
	effect,
	effectId,
	dataCtx,
	internalCtx,
) => {
	let result: unknown = null;
	let error: unknown = null;
	let promise: Promise<unknown> | null = null;
	return {
		run() {
			if (result) {
				return [result, null];
			}
			if (error) {
				return [null, error];
			}
			if (promise) {
				throw promise;
			}
			promise = effect()
				.then((effectResult) => {
					result = effectResult;
					dataCtx.effects[effectId] = { data: result, error: null };
					promise = null;
				})
				.catch((err) => {
					error = err;
					dataCtx.effects[effectId] = { data: null, error };
					promise = null;
				});
			internalCtx.promises.push(promise);
			throw promise;
		},
	};
};

