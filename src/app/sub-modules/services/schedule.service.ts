

import { environment } from '../../../environments/environment';
import { Injectable	} from '@angular/core';
import { Events		} from '../models/plan';
import { Guests		} from '../models/roster';
import { Hosts		} from '../models/roster';
import { Presbies	} from '../models/roster';
import { ISchedule	} from '../models/plan';

@Injectable({providedIn: 'root'})
export class ScheduleService implements ISchedule {
	e: any;
	d: boolean;
	l: boolean;
	actives: Presbies;
	aGs:	{[key: string]: Guests	};
	aHs:	{[key: string]: Hosts	};
	unGs:	{[key: string]: Guests	};
	unHs:	{[key: string]: Hosts	};
	
	constructor(presbies: Presbies, events: Events) {
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		
		console.log('\t> Schedule > New() > ARGS:');
		console.log('\t\tevent:', Array.isArray(events), typeof events, events);

		this.actives = presbies.filter(presby => presby.isActive);
		console.log('\t\tpresbies:', this.actives.length, 'actives found');

		console.log('\t\tinitializing events...');
		for (const event of events) {
			const evt = event.name;
			console.log('\t\t\tevent:', evt);
			this.aHs[evt]	= <Hosts>[];
			this.unHs[evt]	= <Hosts>[];
			this.aGs[evt]	= <Guests>[];
			this.unGs[evt]	= <Guests>[];
		}
	}
}
