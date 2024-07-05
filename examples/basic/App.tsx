import * as React from 'react';
import {hydrateRoot} from 'react-dom/client';
import {Page} from './Page';

const container = document.getElementById('root');
hydrateRoot(container!, <Page />);
