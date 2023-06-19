import * as React from 'react';
import {Heroes} from './Heroes';
import {SSEdataProvider} from '../../../src/index';

export default function HeroList({
	endpoint,
}: {
	endpoint: string;
}) {
	return (
		<SSEdataProvider>
			<Heroes endpoint={endpoint}/>
		</SSEdataProvider>
	);
}
