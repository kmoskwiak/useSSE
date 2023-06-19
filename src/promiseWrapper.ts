import {type PromiseWrapper} from './useSSE.type';

export const promiseWrapper: PromiseWrapper = (
	effect,
	effectId,
	dataCtx,
	internalCtx,
) => {
	let result: unknown = null;
	let error: unknown = null;
	let promise: Promise<unknown> | undefined;
	return {
		run() {
			if (result) {
				return [result, null];
			}

			if (error) {
				return [null, error];
			}

			if (promise) {
				// eslint-disable-next-line @typescript-eslint/no-throw-literal
				throw promise;
			}

			promise = effect()
				.then(effectResult => {
					result = effectResult;
					dataCtx.effects[effectId] = {data: result, error: null};
					promise = undefined;
				})
				.catch(err => {
					error = err;
					dataCtx.effects[effectId] = {data: null, error};
					promise = undefined;
				});
			internalCtx.promises.push(promise);
			// eslint-disable-next-line @typescript-eslint/no-throw-literal
			throw promise;
		},
	};
};

