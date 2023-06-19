import * as React from 'react';
import {useContext} from 'react';
import {DataContext} from './useSSE.context';
import {useWaitForResolve} from './useWaitForResolve';

/**
 * ScriptInjector renders a script tag on server side with stringified data
 * For each render area there is a script tag
 * @returns
 */
export const ScriptInjector = () => {
	const dataContextValue = useContext(DataContext);
	const {effects} = dataContextValue;
	useWaitForResolve();
	const contextId = dataContextValue.id;
	let data = {};
	if (typeof window !== 'undefined' && window.__useSSE_data) {
		data = window.__useSSE_data[contextId];
	} else {
		data = effects;
	}

	const createScript = () => ({
		__html: `
          window.__useSSE_data = {
              ...window.__useSSE_data,
              "${contextId}": {
                ...(${JSON.stringify(data)})
              }
          };
      `,
	});

	return (
		<script
			data-use-sse
			data-use-sse-context-id={contextId}
			dangerouslySetInnerHTML={createScript()}
		/>
	);
};

