import React from 'react';
import {useSSE} from '../../../src/index';
import axios from 'axios';

export const Heroes = ({
	endpoint,
}: {
	endpoint: string;
}) => {
	const [response, error] = useSSE(async () => axios.get(`http://127.0.0.1:3000/${endpoint}`)
		.then(res => res.data)
		.catch(error => {
			throw 'Error!';
		}), []);

	return (
		<div data-testid={endpoint}>
			<h1>Heroes</h1>
			{
				response && response.map((hero: any, index: number) => (
					<div key={index}>
						{ hero.firstName } { hero.lastName } { hero.skill }
					</div>
				))
			}

			{ error }
		</div>
	);
};
