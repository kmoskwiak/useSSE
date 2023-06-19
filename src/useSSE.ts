import {
	useContext,
	useId,
	useState,
	useEffect,
} from 'react';
import { promiseWrapper } from './promiseWrapper';
import { DataContext, InternalContext } from './useSSE.context';
import { getServerSideData } from './utils';

export const useSSE = <ReturnData = unknown, Error = unknown>(
	effect: () => Promise<ReturnData>,
	dependencies: React.DependencyList,
): [ReturnData, Error] => {
	const dataCtx = useContext(DataContext);
	const internalCtx = useContext(InternalContext);
	const effectId = useId();
	const internalReference = internalCtx.effects[effectId];
	const [data, setData] = useState<ReturnData | null>(
		internalReference?.data as ReturnData ?? getServerSideData<ReturnData>(effectId)?.data ?? null
	);
	const [error, setError] = useState(
		internalReference?.error ?? getServerSideData<ReturnData, Error>(effectId)?.error ?? null
	);

	if (internalCtx.isServer) {
		const promise = promiseWrapper(
			effect,
			effectId,
			dataCtx,
			internalCtx,
		);

		if (!internalCtx.effects[effectId]) {
			internalCtx.effects[effectId] = { data: null, error: null };
			promise.run();
		}

		return [dataCtx.effects[effectId].data, dataCtx.effects[effectId].error] as [ReturnData, Error];
	}

	useEffect(() => {
		if (data || error) {
			return;
		}

		effect()
			.then(result => {
				setData(result);
			})
			.catch(error => {
				setError(error);
			});
	}, dependencies);

	return [data, error] as [ReturnData, Error];
};

