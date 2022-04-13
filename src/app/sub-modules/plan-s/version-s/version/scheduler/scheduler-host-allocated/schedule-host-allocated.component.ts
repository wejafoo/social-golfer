

import { environment		} from '../../../../../../../environments/environment';
import { Component			} from '@angular/core';
import { Input				} from '@angular/core';
import { CdkDragDrop		} from '@angular/cdk/drag-drop';
import { transferArrayItem	} from '@angular/cdk/drag-drop';
import { moveItemInArray	} from '@angular/cdk/drag-drop';
import { ScheduleService	} from '../../../../../services/schedule.service';

@Component({
	selector: 'app-schedule-host-allocated',
	templateUrl: './schedule-host-allocated.component.html',
	styleUrls: ['./schedule-host-allocated.component.sass']
})
export class ScheduleHostAllocatedComponent {
	e: any;
	d: boolean;
	l: boolean;
	@Input() event: string;
	
	constructor(public	schedule: ScheduleService)	{
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t\t\t>>> SchedulerHostAllocated:', this.event);
	}
	dropHost(hostDrop: CdkDragDrop<any[]>): void	{
		if (this.d) console.log('\t\t\t>>> SchedulerHostAllocated > dropHost() > event:', this.event, hostDrop);
		const fromContainer	= hostDrop.previousContainer.id;
		const toContainer 	= hostDrop.container.id;
		const prevHost		= hostDrop.previousContainer.data;
		const currHost		= hostDrop.container.data;
		const currHostIdx 	= hostDrop.currentIndex;
		const prevHostIdx 	= hostDrop.previousIndex;
		if (fromContainer === toContainer) {
			console.log('SCHEDULE:', this.schedule);
			moveItemInArray(hostDrop.container.data, hostDrop.previousIndex, hostDrop.currentIndex)
		} else {
			transferArrayItem(prevHost, currHost, prevHostIdx, currHostIdx)
			this.schedule.allocateHost(this.event, undefined, hostDrop);
		}
	}
}
