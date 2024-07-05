import { promiseWrapper } from "../promiseWrapper";

const promiseWithResolvers = () => {
    let resolve: (val: unknown) => void;
    let reject: (val: unknown) => void;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    // @ts-ignore
    return { resolve, reject, promise };
}

describe('promiseWrapper', () => {
    it('should return result of a resolved promise', async () => {
        const { resolve, promise } = promiseWithResolvers();
        const effect = () => promise;
        const internalCtx = {
            promises: [],
            effects: {},
            isServer: false,
            settled: false
        };

        const wrappedPromise = promiseWrapper(
            effect,
            '1',
             { effects: {} },
             internalCtx
        );

        resolve('resolved');

        try { wrappedPromise.run() } catch (promise) { 
            await promise;
        };

        expect(wrappedPromise.run()).toEqual(['resolved', null]);
    });

    it('should return error of a failed promise', async () => {
        const { reject, promise } = promiseWithResolvers();
        const effect = () => promise;
        const internalCtx = {
            promises: [],
            effects: {},
            isServer: false,
            settled: false
        };

        const wrappedPromise = promiseWrapper(
            effect,
            '1',
             { effects: {} },
             internalCtx
        );

        reject('rejected');

        try { wrappedPromise.run() } catch (promise) { 
            await promise;
        };

        expect(wrappedPromise.run()).toEqual([null, 'rejected']);
    });
});