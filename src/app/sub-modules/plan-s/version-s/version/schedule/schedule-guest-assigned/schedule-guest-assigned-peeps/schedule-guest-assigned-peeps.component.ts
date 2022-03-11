

import { environment	} from '../../../../../../../../environments/environment';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { PlanService	} from '../../../../../../services/plan.service';

@Component({
	selector: 'app-schedule-guest-assigned-peeps',
	templateUrl: './schedule-guest-assigned-peeps.component.html',
	styleUrls:	['./schedule-guest-assigned-peeps.component.sass']
})
export class ScheduleGuestAssignedPeepsComponent {
	e: any;
	d: boolean;
	l: boolean;
	openSeats: number;
	@Input() event;
	
	constructor(public	plan: PlanService)						{
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t\t\t>>> ScheduleGuestAssignedPeeps');
	}
	countSeats		(total:	number, assigned: number): string	{
		let rtnVal;
		this.openSeats = total - assigned;
		if (this.openSeats > 0) {rtnVal = 'under-booked'} else if (this.openSeats < 0) {rtnVal = 'over-booked'} else { rtnVal = 'perfectly-booked'}
		return rtnVal;
	}
}
