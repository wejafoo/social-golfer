

import { environment		} from '../../../../../../../environments/environment';
import { Component			} from '@angular/core';
import { Input				} from '@angular/core';
import { CdkDragDrop		} from '@angular/cdk/drag-drop';
import { ScheduleService	} from '../../../../../services/schedule.service';

@Component({
	selector: 'app-schedule-guest-unassigned',
	templateUrl: './scheduler-guest-unassigned.component.html',
	styleUrls: ['./scheduler-guest-unassigned.component.sass']
})
export class SchedulerGuestUnassignedComponent {
	e: any;
	d: boolean;
	l: boolean;
	@Input() event: string;
	
	constructor(public	schedule: ScheduleService) {
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t\t\t>>> SchedulerGuestUnassigned');
	}
	
	unDropGuest(guestDrop: CdkDragDrop<any[]>): void {							// unDropGuest(gstDrp: CdkDragDrop<any[]>, evt: string): void {
		const fromHst	= guestDrop.previousContainer.id;
		const toHst		= guestDrop.container.id; 								// const gst = guestDrop.item.data.guestKey;  // const fromIdx = guestDrop.previousIndex;
		if (fromHst !== toHst) {
			// this.schedule.deAssignGuest(evt, fromHst, gst, fromIdx)
		} else { console.log('SCHEDULE:', this.schedule) }
	}
}
