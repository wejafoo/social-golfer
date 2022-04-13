

import { environment } from '../../../../../../../environments/environment';
import { Component    } from '@angular/core';
import { Input         } from '@angular/core';
import {CdkDragDrop, transferArrayItem} from '@angular/cdk/drag-drop';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ScheduleService  } from '../../../../../services/schedule.service';

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
	
	constructor(public	schedule: ScheduleService) {
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t\t\t>>> SchedulerHostUnallocated');
	}
	unDropHost(hostUnDrop: CdkDragDrop<any[]>): void {
		if (this.d) console.log('\t\t\t>>> SchedulerHostAllocated > unDropHost() > event:', this.event, hostUnDrop);
		const fromHost		= hostUnDrop.previousContainer.id;
		const toHost 		= hostUnDrop.container.id;
		const prevHost		= hostUnDrop.previousContainer.data;
		const currHost		= hostUnDrop.container.data;
		const currHostIdx 	= hostUnDrop.currentIndex;
		const prevHostIdx 	= hostUnDrop.previousIndex;
		
		if (fromHost === toHost) {
			console.log('SCHEDULE:', this.schedule);
			moveItemInArray(prevHost, prevHostIdx, currHostIdx)
		} else {
			transferArrayItem(prevHost, currHost, prevHostIdx, currHostIdx);
			this.schedule.deAllocateHost(this.event, currHostIdx);
		}
	}
}
