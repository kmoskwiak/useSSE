import { useContext } from 'react';
import { InternalContext } from './useSSE.context';
import { type InternalContextType } from './useSSE.type';

const waitWrapper = (internalCtx: InternalContextType) => {
	let promise: null | Promise<any> = null;
	return {
		run() {
			if (internalCtx.settled) {
				return internalCtx.settled;
			}
			if (promise) {
				throw promise;
			}

			promise = Promise.allSettled(internalCtx.promises).then(() => {
				internalCtx.settled = true;
				promise = null;
			});

			throw promise;
		},
	};
};

/**
 * Wait for all promises to resolve
 */
export const useWaitForResolve = () => {
	const internalCtx = useContext(InternalContext);
	if (internalCtx && internalCtx.isServer) {
		waitWrapper(internalCtx).run();
	}
};
