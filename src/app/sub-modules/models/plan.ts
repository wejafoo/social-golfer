

import { Guests		} from './roster'
import { Hosts		} from './roster'
import { Presbies	} from './roster'

export type Events = IEvent[];
export type Plans   = IPlan[];
export type Versions = IVersion[];

export interface IPlan {
	id:			number;
	name:		string;
	versions:	Versions;
}
export interface IVersion {
	id:		 number;
	labels:	  string[];
	events:	   Events;
	schedule?:  ISchedule;
	isVerSched?: boolean;
}
export interface IEvent {
	id:		number;
	name:	string;
}
export interface ISchedule  {
	actives?: Presbies;
	aHs?:	{[key: string]: Hosts	};
	unGs?:	{[key: string]: Guests	};
	unHs?:	{[key: string]: Hosts	};
}
