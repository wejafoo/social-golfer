

import { environment } from '../../../../../../../environments/environment';
import { Component	  } from '@angular/core';
import { EventEmitter  } from '@angular/core';
import { Output			} from '@angular/core';
import { Input			 } from '@angular/core';
import { ScheduleService  } from '../../../../../services/schedule.service';

@Component({
	selector: 'app-schedule-guest-summary',
	templateUrl: './schedule-guest-summary.component.html',
	styleUrls: ['./schedule-guest-summary.component.sass']
})
export class ScheduleGuestSummaryComponent {
	e: any;
	d: boolean;
	l: boolean;
	@Input() event: string;
	@Input() isPeeps: boolean;
	@Output() peepsClick = new EventEmitter();
	
	constructor(public schedule: ScheduleService) {
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t\t\t>>> SchedulerGuestSummary > Event:', this.event);
	}
	clickPeepsButton(event): void {
		if (this.d) console.log('event:', event);
		this.peepsClick.emit();
	}
}
