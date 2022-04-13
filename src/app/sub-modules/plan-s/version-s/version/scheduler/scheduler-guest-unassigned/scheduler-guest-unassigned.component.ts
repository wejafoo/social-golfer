
import { environment		} from '../../../../../../../environments/environment';
import { Component			} from '@angular/core';
import { Input				} from '@angular/core';
import { CdkDragDrop		} from '@angular/cdk/drag-drop';
import { moveItemInArray	} from '@angular/cdk/drag-drop';
import { transferArrayItem	} from '@angular/cdk/drag-drop';
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
	unDropGuest(guestDrop: CdkDragDrop<any[]>): void {
		const fromContainerId	= guestDrop.previousContainer.id;
		const toContainerId		= guestDrop.container.id;
		const prevHost			= guestDrop.previousContainer.data;
		const currHost			= guestDrop.container.data;
		const currGuestIdx 		= guestDrop.currentIndex;
		const prevGuestIdx 		= guestDrop.previousIndex;
		
		if (fromContainerId === toContainerId) {
			console.log('SCHEDULE:', this.schedule);
			moveItemInArray(currHost, prevGuestIdx, currGuestIdx)
		} else {
			transferArrayItem(prevHost, currHost, prevGuestIdx, currGuestIdx);
			this.schedule.deAssignGuest(this.event, undefined, undefined, false, guestDrop);
		}
	}
}
