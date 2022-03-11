

import { environment	} from '../../../../../../../environments/environment';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { PlanService	} from '../../../../../services/plan.service';

@Component({
	selector: 'app-schedule-host-allocated',
	templateUrl: './schedule-host-allocated.component.html',
	styleUrls: ['./schedule-host-allocated.component.sass']
})
export class ScheduleHostAllocatedComponent {
	e: any;
	d: boolean;
	l: boolean;
	@Input() event;
	
	constructor(public	plan: PlanService) {
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t\t\t>>> ScheduleHostAllocated');
	}
}
