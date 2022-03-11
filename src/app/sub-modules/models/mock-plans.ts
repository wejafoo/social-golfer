

import { IPlan } from './plan';

export const PLANS: IPlan[] = [{
	id: 0,
	name: 'Spring 2022',
	versions: [
		{id: 0, labels: ['first'], events: [{id: 1, name: 'January'}, {id: 2, name: 'February'}]},
		{id: 1, labels: ['latest', 'test', 'added-march'	], events: [{id: 1, name: 'January'}, {id: 2, name: 'February'}, {id: 3, name: 'March'}]}
	]
}];
