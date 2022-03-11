

import { Guests		} from './roster'
import { Hosts		} from './roster'
import { Presbies	} from './roster'

export type Plans		= IPlan[];
export type Versions	= IVersion[];
export type Events		= IEvent[];

export interface IPlan {
	id:			number;
	name:		string;
	versions:	Versions;
}
export interface IVersion {
	id:			number;
	labels:		string[];
	events:		Events;
	schedule?:	ISchedule;
}
export interface IEvent {
	id:		number;
	name:	string;
}
export interface ISchedule  {
	actives?: Presbies;
	aGs?:	{[key: string]: Guests	};
	aHs?:	{[key: string]: Hosts	};
	unGs?:	{[key: string]: Guests	};
	unHs?:	{[key: string]: Hosts	};
}
