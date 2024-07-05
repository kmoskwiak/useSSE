import { type FC, createContext, useId } from 'react';
import { type DataContextType, type InternalContextType } from './useSSE.type';
import { ScriptInjector } from './ScriptInjector';
import { detectIsServer } from './utils';

export const InternalContext = createContext<InternalContextType>({
	effects: {},
	isServer: false,
	settled: false,
	promises: [],
});

export const DataContext = createContext<DataContextType>({
	effects: {},
});

export const UniversalDataProvider: FC<{
	children: JSX.Element
	isServer?: boolean
}> = ({
	children,
	isServer = detectIsServer(),
}) => {
		const contextId = useId();
		const internalContextValue: InternalContextType = {
			effects: {},
			isServer,
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

export const ServerDataProvider: FC<{ children: JSX.Element }> = ({
	children,
}) => {
	return (
		<UniversalDataProvider isServer={true}>{children}</UniversalDataProvider>
	);
};

export const BrowserDataProvider: FC<{ children: JSX.Element }> = ({
	children,
}) => {
	return (
		<UniversalDataProvider isServer={false}>{children}</UniversalDataProvider>
	);
};