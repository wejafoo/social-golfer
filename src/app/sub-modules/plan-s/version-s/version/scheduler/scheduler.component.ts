

import { environment		} from '../../../../../../environments/environment';
import { Component			} from '@angular/core';
import { Inject				} from '@angular/core';
import { OnInit				} from '@angular/core';
import { ActivatedRoute		} from '@angular/router';
import { Router				} from '@angular/router';
import { MAT_DIALOG_DATA	} from '@angular/material/dialog';
import { MatDialog			} from '@angular/material/dialog';
import { Apollo				} from 'apollo-angular';
import { PlanService		} from '../../../../services/plan.service';
import { IVersion			} from '../../../../models/plan';
import { PresbyService		} from '../../../../services/presby.service';
import { ScheduleService	} from '../../../../services/schedule.service';

import isObject from 'subscriptions-transport-ws/dist/utils/is-object';

@Component({selector: 'app-plan-export', templateUrl: './schedule-export.html'})
export class ScheduleExportComponent {constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}} // this.results = JSON.stringify(data['aGs'])}

@Component({
	selector: 'app-schedule',
	templateUrl: './scheduler.component.html',
	styleUrls: ['./scheduler.component.sass']
})
export class SchedulerComponent implements OnInit {
	e:    any;
	d:     boolean;
	l:      boolean;
	planId:  number;
	version:  IVersion;
	versionId: number;
	isPeeps	= true;
	loaded = false;
	step  = 1;
	
	constructor(
		public	plan:		PlanService,
		public	presby:		PresbyService,
		public	schedule:	ScheduleService,
		private	apollo:		Apollo,
		private dialog:		MatDialog,
		private	route:		ActivatedRoute,
		private	router:		Router
	)											{
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('active plan:',		this.plan.plan);
		if (this.d) console.log('active version:',	this.plan.version);
	}
	ngOnInit		():			 			void {
		this.route.params.subscribe(params => {
			if (this.d) console.log('\t\t>> Scheduler > PARAMS:', params);
			this.planId		= +params.planId;
			this.versionId	= +params.versionId;
			this.version	= JSON.parse(JSON.stringify(this.plan.version));
			const pairs: {[key: string]: string[]} = {};
			for (const a1 of this.schedule.actives) {
				pairs[a1.key] = [];
				for (const a2 of this.schedule.actives) { if (a1 !== a2) pairs[a1.key].push(a2.key) }
			}
			this.schedule.summary.pairs = JSON.parse(JSON.stringify(pairs));
			for (const event of this.plan.events) {
				const evt = event.name;
				this.schedule.loadEvent(evt);
			}
			this.autoAllocUniqs();
			this.autoAllocate('all');
			this.autoAssign('all');
			this.loaded = true;
	})}
	autoAllocUniqs	(): 		  			 void {
		if (this.d) console.log('\t\t\t>>> Scheduler > autoAllocateUniqs()');
		const events	= Object.keys(this.schedule.unHs);
		const uniqs		= [];
		for (const evt1 of events) {
			if (this.d) console.log('\t\t\t>>> Scheduler > autoAllocateUniqs() > Event:', evt1);
			for (const hst1 of this.schedule.unHs[evt1]) {
				const searchObj = {event: hst1.event, host: hst1.hostKey, unique: true};
				for (const evt2 of events) {
					if (evt1 !== evt2) {
						for (const hst2 of this.schedule.unHs[evt2]) {
							if (searchObj.host === hst2.hostKey) {
								searchObj.unique = false;
								break
					}}}
					if (!searchObj.unique) { break }
				}
				if (searchObj.unique) {
					if (this.d) console.log('\t\t\t\t\tHost:', searchObj.host, 'uniq?', searchObj.unique);
					uniqs.push(searchObj)
		}}}
		
		for (const uniq of uniqs) {
			const uniqEvt = uniq.event;
			const uniqHst = uniq.host;
			for (const event of this.plan.events) {
				const evt = event.name
				if (evt === uniqEvt) {
					let hCnt = 0;
					for (const hst of this.schedule.unHs[evt]) {
						if (hst.hostKey === uniqHst) {
							this.schedule.allocateHost(evt, hCnt);
							break
						}
						hCnt++
					}
				}
			}
		}
	}
	autoAllocate	(ctx: string):			  void {
		console.log('*** *** auto-host allocation *** ***');
		let events: string[];
		if (ctx === 'all') { events = Object.keys(this.schedule.unHs) } else { events = [ctx] }
		events.every(event => this.schedule.unHs[event].sort(() => Math.random() - 0.5));						// TODO: revisit random-ish auto-assigned hosts
		for (const evt of events) {
			let hstIdx = 0;
			while (
				this.schedule.summary[evt].allocatedSeatCnt	< this.schedule.summary[evt].rsvps  &&
				this.schedule.unHs[evt][hstIdx] !==	undefined
			) {
				if (!this.schedule.unHs[evt][hstIdx].isDisabled) { this.schedule.allocateHost(evt, hstIdx) } else { hstIdx++ }
	}}}
	autoAssign		(ctx: string):			   void {
		console.log('*** *** auto-guest assignment *** ***');
		let events: string[];
		if (ctx === 'all') { events = Object.keys(this.schedule.unGs) } else { events = [ctx] }
		for (const evt of events) {
			let cnt		= 0;
			let skipCnt	= 0;
			const startUnGsCnt = this.schedule.unGs[evt].length;
			this.schedule.unGs[evt].sort(() => Math.random() - 0.5);											// Todo: refactor large groups first, eventually: // this.plan.unGs[evt].sort((a: {guests: string[]},b: {guests: string[]}) => b.guests.length - a.guests.length);
			while (
				this.schedule.summary[evt].assignedGuestCnt < this.schedule.summary[evt].allocatedSeatCnt	&&
				this.schedule.summary[evt].unAssignedGuestCnt > 0	&&  cnt < startUnGsCnt
			) {
				cnt++;
				const nextHost	= this.schedule.summary[evt].nextHost;
				const nextGuest	= this.schedule.unGs[evt][skipCnt].guestKey;
				for (const aHost of this.schedule.aHs[evt]) {
					if (aHost.hostKey === nextHost) {
						if ( this.schedule.assignGuest(evt, nextHost, nextGuest) ) { break } else { skipCnt++ }
	}}}}}
	back			():		 	   	 			void {
		this.router.navigate(['/plan', this.planId]).then()
	}
	next			():		  		  			 void {
		this.step++
	}
	peepsClick		():  		 	   			  void {
		this.isPeeps = !this.isPeeps
	}
	prev			():							   void {
		this.step--
	}
	save			():						 		void {
		this.plan.version.id++;
		// this.plan.persistCurrentVersion();
		localStorage.setItem(this.planId + '-latest', JSON.stringify(this.schedule));
		localStorage.setItem(this.planId + '-' + String(this.plan.version.id), JSON.stringify(this.schedule));
		const dialogRef = this.dialog.open(ScheduleExportComponent, {width: '640px', disableClose: true, data: this.schedule});
		dialogRef.afterClosed().subscribe();
	}
	setStep			(index: number):		         void {
		this.step = index
	}
	deepEqual		(object1: any, object2: any): boolean {
		const keys1 = Object.keys(object1);
		const keys2	= Object.keys(object2);
		let rtnVal	= false
		if (keys1.length !== keys2.length) { return false } else {
			let val1: any;
			let val2: any;
			for ( const key1 of keys1 ) {
				for ( const key2 of keys2 ) {
					val1 = object1[key1];
					val2 = object2[key2];
					const areObjects = isObject(val1) && isObject(val2);
					if (areObjects) { rtnVal = true } else { return false }
				}
			}
			return rtnVal;
		}
	}
}
