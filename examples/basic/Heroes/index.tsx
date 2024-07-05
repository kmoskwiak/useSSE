import * as React from 'react';
import { Heroes } from './Heroes';
import { UniversalDataProvider } from '../../../src/index';

export default function HeroList({
	endpoint,
}: {
	endpoint: string;
}) {
	return (
		<UniversalDataProvider>
			<Heroes endpoint={endpoint} />
		</UniversalDataProvider>
	);
}
