import '@testing-library/jest-dom'
import { DataContext } from '../useSSE.context';
import { ScriptInjector } from '../ScriptInjector';
import { renderToString } from 'react-dom/server';
import { HTMLToJSON } from 'html-to-json-parser'
import { JSONContent } from 'html-to-json-parser/dist/types';

describe('ScriptInjector', () => {
    it('should render script tag with effects', async () => {
        const effectId = 'test-1'
        const dataContextValue = {
            effects: {
                [effectId]: {
                    data: 'data',
                    error: null,
                    loading: false
                }
            }
        };
        const scriptNode = renderToString(
            <DataContext.Provider value={dataContextValue}>
                <ScriptInjector />
            </DataContext.Provider>
        );

        const parsedScriptNode = await HTMLToJSON(scriptNode) as JSONContent;

        expect(parsedScriptNode.type).toBe('script');
        expect(parsedScriptNode.attributes).toEqual({
            'data-use-sse': 'true',
            'data-use-sse-ids': effectId,
        });
        expect(parsedScriptNode.content).toHaveLength(1);
    });
});