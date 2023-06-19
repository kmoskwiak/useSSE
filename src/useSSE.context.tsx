import * as React from 'react';
import {type FC, createContext, useId} from 'react';
import {type DataContextType, type InternalContextType} from './useSSE.type';
import {ScriptInjector} from './ScriptInjector';
import {isServer} from './utils';

export const InternalContext = createContext<InternalContextType>({
	effects: {},
	isServer: false,
	settled: false,
	promises: [],
});

export const DataContext = createContext<DataContextType>({
	id: '',
	effects: {},
});

export const SSEdataProvider: FC<{children: JSX.Element}> = ({
	children,
}) => {
	const contextId = useId();
	const internalContextValue: InternalContextType = {
		effects: {},
		isServer: isServer(),
		settled: false,
		promises: [],
	};
	const dataContextValue = {
		id: contextId,
		effects: {},
	};

	return (
		<InternalContext.Provider value={internalContextValue}>
			<DataContext.Provider value={dataContextValue}>
				<>{children}</>
				<ScriptInjector />
			</DataContext.Provider>
		</InternalContext.Provider>
	);
};
