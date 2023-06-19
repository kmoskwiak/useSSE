import {type DataContextType, type EffectReference} from './useSSE.type';

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
export const getServerSideData = (id: string, contextId: string): EffectReference | undefined => {
	if (typeof window !== 'undefined') {
		return window.__useSSE_data?.[contextId]?.[id];
	}
};

export const isServer = (): boolean => Boolean(typeof window === 'undefined');
