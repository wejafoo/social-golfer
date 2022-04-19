
import { environment  } from '../../../../../../../environments/environment';
import { Component	   } from '@angular/core';
import { Input		    } from '@angular/core';
import { ScheduleService } from '../../../../../services/schedule.service';

@Component({
	selector:   'app-schedule-host-summary',
	templateUrl: './schedule-host-summary.component.html',
	styleUrls: [  './schedule-host-summary.component.sass'	]
})
export class ScheduleHostSummaryComponent {
	e: any;
	d: boolean;
	l: boolean;
	@Input() event;
	
	constructor	(public	schedule: ScheduleService)	{
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t\t\t>>> SchedulerHostSummary');
	}
}
