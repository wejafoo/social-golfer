

import { environment	} from '../../../../../../../environments/environment';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { PlanService	} from '../../../../../services/plan.service';

@Component({
	selector: 'app-schedule-guest-assigned',
	templateUrl: './schedule-guest-assigned.component.html',
	styleUrls: ['./schedule-guest-assigned.component.sass']
})
export class ScheduleGuestAssignedComponent {
	e: any;
	d: boolean;
	l: boolean;
	@Input() isPeeps = true;
	@Input() event;
	
	constructor(public	plan: PlanService) {
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t\t\t>>> ScheduleGuestAssigned');
	}
}
