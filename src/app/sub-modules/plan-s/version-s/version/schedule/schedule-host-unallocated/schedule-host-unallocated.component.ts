

import { environment	} from '../../../../../../../environments/environment';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { PlanService	} from '../../../../../services/plan.service';

@Component({
	selector: 'app-schedule-host-unallocated',
	templateUrl: './schedule-host-unallocated.component.html',
	styleUrls: ['./schedule-host-unallocated.component.sass']
})
export class ScheduleHostUnallocatedComponent {
	e: any;
	d: boolean;
	l: boolean;
	@Input() event;
	
	constructor(public	plan: PlanService) {
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t\t\t>>> ScheduleHostUnallocated');
	}
}
