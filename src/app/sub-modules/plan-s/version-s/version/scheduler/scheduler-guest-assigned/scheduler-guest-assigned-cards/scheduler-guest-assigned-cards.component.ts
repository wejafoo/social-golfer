

import { environment } from '../../../../../../../../environments/environment';
import { Component    } from '@angular/core';
import { Input         } from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, transferArrayItem} from '@angular/cdk/drag-drop';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ScheduleService  } from '../../../../../../services/schedule.service';

@Component({
	selector: 'app-schedule-guest-assigned-cards',
	templateUrl: './scheduler-guest-assigned-cards.component.html',
	styleUrls: ['./scheduler-guest-assigned-cards.component.sass']
})
export class SchedulerGuestAssignedCardsComponent {
	e:      any;
	d:       boolean;
	l:        boolean;
	openSeats: number;
	@Input() event;
	
	constructor		(public	schedule: ScheduleService)			{
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t\t\t\t>>>> SchedulerGuestAssignedCards');
	}
	countSeats		(total: number, assigned: number):		string {
		let rtnVal;
		this.openSeats = total - assigned;
		if (this.openSeats > 0) { rtnVal = 'under-booked' } else if (this.openSeats < 0) { rtnVal = 'over-booked' } else { rtnVal = 'perfectly-booked'}
		return rtnVal;
	}
	dropGuest		(guestDrop: CdkDragDrop<any[]>):			void {
		const fromContainer	= guestDrop.previousContainer.id;
		const toContainer	= guestDrop.container.id;
		const prevHost		= guestDrop.container.data;
		const currHost		= guestDrop.container.data;
		const prevGuestIdx	= guestDrop.previousIndex;
		const currGuestIdx	= guestDrop.currentIndex;
		// const gst = guestDrop.item.data.guestKey;
		if (fromContainer === toContainer) {
			console.log('SCHEDULE:', this.schedule, '\n** SUMMARY:', this.schedule.summary);
			moveItemInArray(currHost, prevGuestIdx, currGuestIdx)
		} else {
			transferArrayItem(prevHost, currHost, prevGuestIdx, currGuestIdx);
			this.schedule.assignGuest(this.event, undefined, undefined, guestDrop);
		}
	}
	pairsPredicate	(): (gstDrg: CdkDrag, hstDrp: CdkDropList) =>	any	{
		return (gstDrg: CdkDrag, hstDrp: CdkDropList) => {
			console.log('Guest Drag object:', gstDrg, 'Host Drag object:', hstDrp);
			console.log('** SUMMARY:', this.schedule.summary);
			const guests: any	= [];
			const gst			= gstDrg.data.guestKey;
			guests.push( ...hstDrp.data );
			return guests.every((guest: {guestKey: string}) => this.schedule.summary['pairs'][gst].includes(guest.guestKey) || hstDrp.id === 'unassigned')
		}
	}
}
