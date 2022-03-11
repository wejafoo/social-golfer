

import { environment	} from '../../../../../../../environments/environment';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { Router			} from '@angular/router';
import { PlanService	} from '../../../../../services/plan.service';
import { Events			} from '../../../../../models/plan';
import { Plans			} from '../../../../../models/plan';

@Component({templateUrl: './event-list.component.html'})
export class EventListComponent {
	e: any;
	d: boolean;
	l: boolean;
	events: Events;
	@Input() plans: Plans;
	selectedEventId	= 0;
	selectedPlanId	= 0;
	
	constructor (
		public plan:	PlanService,
		public router:	Router
	)									{
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t\t>> EventListComponent');
	}
	addEvent():					void	{
		this.plan.addEvent(this.selectedPlanId, 'New Event')
	}
	rmEvent(eventId: number):	void	{
		this.plan.rmEvent(eventId);
		this.router.navigate(['/plan', 's']).then();
	}
	updateEvent():				void	{
		this.router.navigate(['/plan', this.selectedPlanId, 'event', this.selectedEventId, 'update']).then()
	}
}
