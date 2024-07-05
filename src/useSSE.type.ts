declare global {
	interface Window {
		[k: string]: any;
		__useSSE_data: Record<string, EffectReference>;
	}
}

export type EffectReference = {
	data: unknown;
	error: unknown;
};

export type InternalContextType = {
	effects: Record<string, EffectReference>;
	isServer: boolean;
	settled: boolean;
	promises: Array<Promise<unknown>>;
};

export type DataContextType = {
	effects: Record<string, EffectReference>;
};

export type UseSSE = <ReturnData = unknown, Error = unknown>(
	effect: () => Promise<ReturnData>,
	dependencies: React.DependencyList
) => [ReturnData, Error];

export type WrappedPromise = {
	run: () => [unknown, unknown];
};

export type PromiseWrapper = (
	effect: () => Promise<unknown>,
	effectId: string,
	dataCtx: DataContextType,
	internalCtx: InternalContextType
) => WrappedPromise;
