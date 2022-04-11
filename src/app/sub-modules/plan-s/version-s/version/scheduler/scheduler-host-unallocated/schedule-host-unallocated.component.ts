

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
		console.log('\t\t\t>>> SchedulerHostAllocated > unDropHost() > event:', this.event, hostUnDrop);
		
		const fromHost	= hostUnDrop.previousContainer.id;
		const toHost 	= hostUnDrop.container.id;
		console.log('From Container:', fromHost);
		console.log('To Container:', toHost);

		const prevHost		= hostUnDrop.previousContainer.data;
		const currHost		= hostUnDrop.container.data;
		const currHostIdx 	= hostUnDrop.currentIndex;
		const prevHostIdx 	= hostUnDrop.previousIndex;
		console.log('PLAN:', this.schedule, '\nSUMMARY:', this.schedule.summary);
		
		if (fromHost === toHost) {
			console.log('!!! Intra-container drop !!!');
			moveItemInArray(prevHost, prevHostIdx, currHostIdx)
		} else {
			console.log('!!! Extra-container drop !!!');
			transferArrayItem(prevHost, currHost, prevHostIdx, currHostIdx);
			this.schedule.deAllocateHost(this.event, currHostIdx);
		}
	}
}
