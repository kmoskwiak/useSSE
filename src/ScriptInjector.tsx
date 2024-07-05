import * as React from 'react';
import { useContext } from 'react';
import { DataContext } from './useSSE.context';
import { useWaitForResolve } from './useWaitForResolve';
import { DataContextType } from './useSSE.type';

const getIds = (dataContextValue: DataContextType) => {
	return Object.keys(dataContextValue.effects);
};

export const ScriptInjector = () => {
	const dataContextValue = useContext(DataContext);
	const effects = dataContextValue.effects;
	useWaitForResolve();
	const createScript = () => ({
		__html: `
        window.__useSSE_data = {
            ...window.__useSSE_data,
            ...(${JSON.stringify(effects)})
        };
    `,
	});
	const ids = getIds(dataContextValue);
	return (
		<script
			data-use-sse
			data-use-sse-ids={ids}
			suppressHydrationWarning={true}
			dangerouslySetInnerHTML={createScript()}
		/>
	);
};

