import * as React from 'react';
import HeroList from './Heroes';

export const Page = () => (
	<div>
		<React.Suspense fallback={'Loading...'}>
			<HeroList endpoint={'data'}/>
		</React.Suspense>

		<React.Suspense fallback={'Loading...'}>
			<HeroList endpoint={'error'}/>
		</React.Suspense>

		<React.Suspense fallback={'Loading...'}>
			<HeroList endpoint={'long'}/>
		</React.Suspense>
	</div>
);
