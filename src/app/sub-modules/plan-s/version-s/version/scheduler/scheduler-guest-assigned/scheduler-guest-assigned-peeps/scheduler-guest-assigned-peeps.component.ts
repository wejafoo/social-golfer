
import { environment } from '../../../../../../../../environments/environment';
import { Component	  } from '@angular/core';
import { Input		   } from '@angular/core';
import { CdkDragDrop	} from '@angular/cdk/drag-drop';
import { CdkDrag		 } from '@angular/cdk/drag-drop';
import { CdkDropList	  } from '@angular/cdk/drag-drop';
import { transferArrayItem } from '@angular/cdk/drag-drop';
import { moveItemInArray	} from '@angular/cdk/drag-drop';
import { ScheduleService	 } from '../../../../../../services/schedule.service';

@Component({
	selector: 'app-schedule-guest-assigned-peeps',
	templateUrl: './scheduler-guest-assigned-peeps.component.html',
	styleUrls:	['./scheduler-guest-assigned-peeps.component.sass']
})
export class SchedulerGuestAssignedPeepsComponent {
	e:	any;
	d:		boolean;
	l:			boolean;
	openSeats:		number;
	@Input() event: 	string;
	
	constructor(public schedule: ScheduleService)			{
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t\t\t\t>>>> SchedulerGuestAssignedPeeps');
	}
	dropGuest		(guestDrop: CdkDragDrop<any[]>):	void	{
		const fromContainerId	= guestDrop.previousContainer.id;
		const toContainerId 	= guestDrop.container.id;
		const prevHost			= guestDrop.previousContainer.data;
		const currHost			= guestDrop.container.data;
		const currGuestIdx 		= guestDrop.currentIndex;
		const prevGuestIdx 		= guestDrop.previousIndex;
		
		if (fromContainerId === toContainerId) {
			moveItemInArray(guestDrop.container.data, guestDrop.previousIndex, guestDrop.currentIndex)
		} else {
			transferArrayItem(prevHost, currHost, prevGuestIdx, currGuestIdx);
			this.schedule.assignGuest(this.event, undefined, undefined, guestDrop);
		}
	}
	countSeats		(total: number, assigned: number):		string	{
		let rtnVal;
		this.openSeats = total - assigned;
		if (this.openSeats > 0) { rtnVal = 'under-booked' } else if (this.openSeats < 0) { rtnVal = 'over-booked' } else { rtnVal = 'perfectly-booked' }
		return rtnVal;
	}
	pairsPredicate	(): (guestDrag: CdkDrag, hostDrop: CdkDropList) => any {
		return (guestDrag: CdkDrag, hostDrop: CdkDropList) => {
			console.log('Guest Drag Object:', guestDrag, '\n\nHost Target(s) Object:', hostDrop);
			const guests: any[] = [];
			guests.push(...hostDrop.data);
			const gst = guestDrag.data.guestKey;
			return guests.every((guest: {guestKey: string}) => {
				return (this.schedule.summary['pairs'][gst].includes(guest.guestKey) || hostDrop.id === 'unassigned')
	})}}
}
