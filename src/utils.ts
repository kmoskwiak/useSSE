import { type DataContextType } from './useSSE.type';

/**
 * Get the effect ids from the data context value
 * @param dataContextValue
 * @returns {string[]} effect ids
 */
export const getIds = (dataContextValue: DataContextType) => Object.keys(dataContextValue.effects);

/**
 * Returns already fetched and included in rendered document data from server
 * @param id
 * @returns {EffectReference} data and error
 */
export const getServerSideData = <TData = unknown, TError = unknown>(id: string): { data: TData, error: TError } | undefined => {
	if (typeof window !== "undefined") {
		return window.__useSSE_data?.[id] as { data: TData, error: TError };
	}
};

export const detectIsServer = (): boolean => Boolean(typeof window === 'undefined');
