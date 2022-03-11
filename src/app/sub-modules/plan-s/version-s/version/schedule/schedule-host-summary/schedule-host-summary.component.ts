

import { environment	} from '../../../../../../../environments/environment';
import {Component, OnInit} from '@angular/core';
import { OnChanges		} from '@angular/core';
import { SimpleChanges	} from '@angular/core';
import { Input			} from '@angular/core';
import { PlanService	} from '../../../../../services/plan.service';

@Component({
	selector: 'app-schedule-host-summary',
	templateUrl: './schedule-host-summary.component.html',
	styleUrls: ['./schedule-host-summary.component.sass']
})
export class ScheduleHostSummaryComponent implements OnInit, OnChanges {
	e: any;
	d: boolean;
	l: boolean;
	@Input() event;
	
	constructor(
		public	plan: PlanService
	) {
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t\t\t>>> ScheduleHostSummary');
	}
	ngOnInit() {
		if (this.d) console.log('\t\t\t>>> ScheduleHostSummary > SUMMARY:', this.plan.summary);
	}
	
	ngOnChanges( changes: SimpleChanges ) {
		console.log( 'CHANGES:', changes);
		for (const propName in changes) {
			if ( propName === 'event') {
				console.log('CHANGE TO PROPERTY:', changes.event.currentValue);
				this.event = changes.event.currentValue;
	}}}
}
