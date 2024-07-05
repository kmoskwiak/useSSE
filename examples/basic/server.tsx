import express from 'express';
import path from 'path';
import fs from 'fs';
import { renderToPipeableStream } from 'react-dom/server';
import { Page } from './Page';

const pageRaw = fs.readFileSync(
	path.resolve(__dirname, '../../dist/index.html'),
	{
		encoding: 'utf-8',
	},
);

const parts = pageRaw.split('<!-- break here -->');
const app = express();

app.use('/static', express.static(path.resolve(__dirname, '../../dist')));

app.use('/error', (req, res) => {
	res.status(503).json({ error: true });
});

app.use('/data', (_req, res) => {
	res.json([{
		id: 1,
		firstName: 'Finn',
		lastName: 'The Human',
		skill: 'Sword Fighting',
	}, {
		id: 2,
		firstName: 'Jake',
		lastName: 'The Dog',
		skill: 'Stretching',
	}, {
		id: 3,
		firstName: 'Princess',
		lastName: 'Bubblegum',
		skill: 'Science',
	}, {
		id: 4,
		firstName: 'Marceline',
		lastName: 'The Vampire Queen',
		skill: 'Singing',
	}]);
});

const wait = async () => new Promise(resolve => {
	setTimeout(resolve, 100);
});

app.use('/long', async (_req, res) => {
	await wait();
	res.json([{
		id: 1,
		firstName: 'Finn',
		lastName: 'The Human',
		skill: 'Sword Fighting',
	}]);
});

app.use('/', async (req, res, next) => {
	if (!['/'].includes(req.path)) {
		next(); return;
	}

	let didError = false;

	const stream = renderToPipeableStream(
		<Page />,
		{
			onShellReady() {
				res.statusCode = didError ? 500 : 200;
				res.setHeader('Content-type', 'text/html');
				res.write(parts[0]);

				res.write(parts[1]);

				stream.pipe(res);

				res.write(parts[2]);

				res.write(parts[3]);
			},
			onShellError() {
				res.statusCode = 500;
				res.send('<h1>An error occurred</h1>');
			},
			onError(err) {
				didError = true;
				console.error(err);
			},
		},
	);
});

app.use((_req, res) => {
	res.status(404).end();
});

app.listen(3000, '0.0.0.0', () => {
	console.log(`${new Date()} Server listening on port 3000`);
});
