/**
 * @jest-environment jsdom
 */
import { getIds, getServerSideData } from "../utils";

describe('getIds', () => {
    it('should return effect ids', () => {
        const ids = ['test-1', 'test-2'];
        const dataContextValue = {
            effects: {
                [ids[0]]: {
                    data: 'data',
                    error: null,
                    loading: false
                },
                [ids[1]]: {
                    data: 'data',
                    error: null,
                    loading: false
                }
            }
        };
        const result = getIds(dataContextValue);
        expect(result).toEqual(ids);
    });
});


describe('getServerSideData', () => {
    it('should return data from window object', () => {
        const id = 'R1';
        const data = { data: 'data', error: null };

        window.__useSSE_data = {
            [id]: data
        };

        const result = getServerSideData(id);
        expect(result).toEqual(data);
    });

    it('should return undefined if window object is not defined', () => {
        const id = 'test-1';
        const result = getServerSideData(id);
        expect(result).toBeUndefined();
    });
});