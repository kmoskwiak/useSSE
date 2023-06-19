import {useContext} from 'react';
import {InternalContext} from './useSSE.context';
import {type InternalContextType} from './useSSE.type';

const waitWrapper = (internalCtx: InternalContextType) => {
	let promise: Promise<unknown> | undefined;
	return {
		run() {
			if (internalCtx.settled) {
				return internalCtx.settled;
			}

			if (promise) {
				// eslint-disable-next-line @typescript-eslint/no-throw-literal
				throw promise;
			}

			promise = Promise.allSettled(internalCtx.promises).then(() => {
				internalCtx.settled = true;
				promise = undefined;
			});

			// eslint-disable-next-line @typescript-eslint/no-throw-literal
			throw promise;
		},
	};
};

/**
 * Wait for all promises to resolve
 */
export const useWaitForResolve = () => {
	const internalCtx = useContext(InternalContext);
	if (internalCtx?.isServer) {
		waitWrapper(internalCtx).run();
	}
};
