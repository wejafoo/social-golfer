

import { environment		} from '../../../../../../environments/environment';
import { Component			} from '@angular/core';
import { Inject				} from '@angular/core';
import { OnInit				} from '@angular/core';
import { ActivatedRoute		} from '@angular/router';
import { Router				} from '@angular/router';
import { MAT_DIALOG_DATA	} from '@angular/material/dialog';
import { MatDialog			} from '@angular/material/dialog';
import { transferArrayItem	} from '@angular/cdk/drag-drop';
import { CdkDragDrop		} from '@angular/cdk/drag-drop';
import { Apollo				} from 'apollo-angular';
import { PlanService		} from '../../../../services/plan.service';
import { IVersion			} from '../../../../models/plan';

@Component({selector: 'app-plan-export', templateUrl: './schedule-export.html'})
export class ScheduleExportComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public data: string) {} // this.results = JSON.stringify(data['aGs'])}
}

@Component({
	selector: 'app-schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.sass']
})
export class ScheduleComponent implements OnInit {
	e: any;
	d: boolean;
	l: boolean;
	planId:	number;
	version: IVersion;
	versionId: number;
	
	isPeeps	= true;
	loaded	= false;
	step	= 1;
	
	constructor(
		public	plan:	PlanService,
		private	apollo:	Apollo,
		private dialog:	MatDialog,
		private	route:	ActivatedRoute,
		private	router:	Router
	) {
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
	}
	ngOnInit		(): void {
		this.route.params.subscribe(params => {
			if (this.d) console.log('\t\t>> Schedule > PARAMS:', params);
			this.planId		= +params.planId;
			this.versionId	= +params.versionId;
			const pairs: {[key: string]: string[]} = {};
			for (const a1 of this.plan.schedule.actives) {
				pairs[a1.key] = [];
				for (const a2 of this.plan.schedule.actives) {
					if (a1 !== a2) {
						pairs[a1.key].push(a2.key)
			}}}
			this.plan.summary['pairs'] = JSON.parse( JSON.stringify(pairs));
			for (const event of this.plan.events) {
				const evt = event.name;
				this.loadEvent(evt);
			}
			this.allocUniqs();
			this.autoAllocate('all');
			this.autoAssign('all');
			this.loaded = true;
	})}
	next			(): void {
		this.step++
	}
	prev			(): void {
		this.step--
	}
	save			(): void {
		this.plan.version.id++;
		// this.plan.persistCurrentVersion();
		localStorage.setItem(this.planId + '-latest', JSON.stringify(this.plan.schedule));
		localStorage.setItem(this.planId + '-' + String(this.plan.version.id), JSON.stringify(this.plan.schedule));
		const dialogRef = this.dialog.open(ScheduleExportComponent, {width: '640px', disableClose: true, data: this.plan.schedule});
		dialogRef.afterClosed().subscribe();
	}
	back			(): void {
		this.router.navigate(['/plan', this.planId]).then()
	}
	allocUniqs		(): void {
		const events = Object.keys(this.plan.schedule.unHs);
		const uniqs = [];
		for (const evt1 of events) {
			for (const hst1 of this.plan.schedule.unHs[evt1]) {
				const searchObj = {
					event: hst1.event, host: hst1.hostKey, unique: true
				};
				for (const evt2 of events) {
					if (evt1 !== evt2) {
						for (const hst2 of this.plan.schedule.unHs[evt2]) {
							if (searchObj.host === hst2.hostKey) {
								searchObj.unique = false;
								break
							}
						}
					}
					if (!searchObj.unique) { break }
				}
				if (searchObj.unique) { uniqs.push(searchObj)}
			}
		}
		for (const uniq of uniqs) {
			const uniqEvt = uniq.event;
			const uniqHst = uniq.host;
			for (const event of this.plan.events) {
				const evt = event.name
				if (evt === uniqEvt) {
					let hCnt = 0;
					for (const hst of this.plan.schedule.unHs[evt]) {
						if (hst.hostKey === uniqHst) {
							this.allocateHost(evt, uniqHst, hCnt);
							break
						}
						hCnt++
					}
				}
			}
		}
	}
	loadEvent		(evt: string): void {
		if (this.d) console.log('\t\t>> Schedule > loadEvent() > Loading ' + evt + '...');
		if (this.d) console.log('\t\t\tHosts from:', this.plan.schedule.actives.length, 'actives');
		for (const active of this.plan.schedule.actives) {
			const hostings	= JSON.parse('[' + active.hostings + ']');
			const activeObj	= Object.assign({}, active);
			let hCnt = 0;
			for (const hosting of hostings) {
				const hostingObj = Object.assign({}, hosting);
				if (hostingObj.event === evt) {
					hostingObj.id = JSON.parse( JSON.stringify(activeObj.id));
					hostingObj.hostName = activeObj.last;
					hostingObj.isDisabled = false;
					hostingObj.hostKey = activeObj.last	+ '-' + activeObj.id	+ '-' + activeObj.seats	+ '-' + activeObj.guests.length;
					if (!('seats' in hostingObj) || hostingObj.seats === null) {
						hostingObj.seats = activeObj.seats
					}
					if ( !('guests' in hostingObj)) {
						hostingObj.guests = JSON.parse( JSON.stringify(activeObj.guests))
					}
					console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', evt, Array.isArray(this.plan.schedule.unHs), this.plan.schedule);
					this.plan.schedule.unHs[evt].push(hostingObj);
					console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', this.plan.schedule.unHs[evt]);
				}
				hCnt++;
			}
		}
		
		/////////////////////////////////////////////  LOAD GUESTING OBJECTS  //
		if (this.d) console.log('\t\t\tGuests from:', this.plan.schedule.actives.length, 'actives');
		for (const active of this.plan.schedule.actives) {
			let gCnt		= 0;
			const guestings	= JSON.parse('[' + active.guestings + ']');
			const activeObj	= Object.assign({}, active);
			for (const guesting of guestings) {
				const guestingObj = Object.assign({}, guesting);
				if (guestingObj.event === evt) {
					if (!('cnt' in guestingObj)	|| guestingObj.cnt === null) {
						guestingObj.cnt = activeObj.guests.length
					}
					if (!('guests' in guestingObj)) {
						guestingObj.guests = activeObj.guests
					}
					guestingObj.id = JSON.parse( JSON.stringify(activeObj.id));
					guestingObj.partyName =
						JSON.parse( JSON.stringify(activeObj.last));
					guestingObj.guestKey =
						activeObj.last + '-' +
						activeObj.id + '-' +
						activeObj.seats	+ '-' +
						activeObj.guests.length;
					this.plan.schedule.unGs[evt].push(guestingObj);
				}
				gCnt++
			}
		}
		
		/////////////////////////////////////////////////////// EVENT SUMMARY //
		this.plan.summary[evt] = {
			guests:	[],
			rsvps:	0,
			seats:	0,
			allocatedSeatCnt:	0,
			unAllocatedSeatCnt:	0,
			overAllocatedSeats:	0,
			assignedGuestCnt:	0,
			unAssignedGuestCnt:	0,
			overAssignedGuests:	0
		}
		
		/////////////////////////////////////////////////////// GUEST SUMMARY //
		for (const gst of this.plan.schedule.unGs[evt]) {
			this.plan.summary[evt].rsvps += gst.guests.length
		}
		
		//////////////////////////////////////////////////////// HOST SUMMARY //
		for ( const host of this.plan.schedule.unHs[evt] ) {
			const hst = host.hostKey;
			this.plan.summary[evt].seats += host.seats;
			this.plan.summary[evt][hst] = {
				isAllocated:		false,
				guests:				[...host.guests],
				hosts:				[...host.guests],
				seats:				host.seats,
				assignedSeatCnt:	0
			}
		}
		if (this.d) console.log('\t\t\tSummary:', this.plan.summary);
	}
	autoAllocate	(ctx: string): void {
		let events: string[];
		if (ctx === 'all') { events = Object.keys(this.plan.schedule.unHs) } else { events = [ctx] }
		events.every(event => this.plan.schedule.unHs[event].sort(() => Math.random() - 0.5));			// TODO: revisit random-ish auto-assigned hosts
		for (const evt of events) {
			let hstIdx = 0;
			while (
				this.plan.summary[evt].allocatedSeatCnt <
					this.plan.summary[evt].rsvps  				&&
				this.plan.schedule.unHs[evt][hstIdx] !== undefined
			) {
				if (!this.plan.schedule.unHs[evt][hstIdx].isDisabled) {
					const hst = this.plan.schedule.unHs[evt][hstIdx].hostKey;
					this.allocateHost(evt, hst, hstIdx);
				} else { hstIdx++ }
			}
		}
	}
	autoAssign		(ctx: string): void {
		let events: string[];
		if (ctx === 'all') {events = Object.keys(this.plan.schedule.unGs)} else {events = [ctx]}
		for (const evt of events) {
			let cnt				= 0;
			let skipCnt			= 0;
			const hosts			= Object.keys(this.plan.schedule.aGs[evt]);
			const startUnGsCnt	= this.plan.schedule.unGs[evt].length;
			// Todo: refactor how "random" auto-assignment works -- large groups first... for now, eventually: // this.plan.unGs[evt].sort((a: {guests: string[]},b: {guests: string[]}) => b.guests.length - a.guests.length);
			this.plan.schedule.unGs[evt].sort(() => Math.random() - 0.5);
			while (
				this.plan.summary[evt].assignedGuestCnt < this.plan.summary[evt].allocatedSeatCnt	&&
				this.plan.summary[evt].unAssignedGuestCnt > 0	&&	cnt < startUnGsCnt
			) {
				cnt++;
				const nextHost	= this.plan.summary[evt].nextHost;
				const nextGuest	= this.plan.schedule.unGs[evt][skipCnt].guestKey;
				for (const hst of hosts) { if (hst === nextHost) { if ( this.plan.assignGuest(evt, hst, nextGuest) ) { break } else { skipCnt++ }}}
	}}}
	setStep			(index: number): void {
		this.step = index
	}
	allocateHost	(evt: string, hst: string, prevHIdx: number, hstDrp?: CdkDragDrop<any[]>): void {
		if (hstDrp) {
			transferArrayItem(
				hstDrp.previousContainer.data,
				hstDrp.container.data,
				hstDrp.previousIndex,
				hstDrp.currentIndex
			)
		}
		this.plan.allocateHost(evt, hst, prevHIdx)
	}
	deAssignGuest	(evt: string, hst: string, gst: string, prevGIdx: number, gstDrp?: CdkDragDrop<any[]>): void {
		if (gstDrp) {
			const fromHost	= gstDrp.previousContainer.data;
			const toHost	= gstDrp.container.data;
			const fromIdx	= gstDrp.previousIndex;
			const toIdx		= gstDrp.currentIndex;
			transferArrayItem(fromHost, toHost, fromIdx, toIdx);
			const fromHst	= gstDrp.previousContainer.id;
			const toHst		= gstDrp.container.id;
			this.plan.rePair(evt, fromHst, toHst, gst);
		}
		this.plan.deAssignGuest(evt, hst, gst, prevGIdx);
	}
}

// deepEqual	(object1: any,	object2: any): boolean	{
// 	const keys1 = Object.keys(object1);
// 	const keys2 = Object.keys(object2);
// 	let rtnVal = false
// 	if (keys1.length !== keys2.length) { return false } else {
// 		let val1: any;
// 		let val2: any;
// 		for ( const key1 of keys1 ) {
// 			for ( const key2 of keys2 ) {
// 				val1 = object1[key1];
// 				val2 = object2[key2];
// 				const areObjects = isObject(val1) && isObject(val2);
// 				if (areObjects) { rtnVal = true } else { return false }
// 			}
// 		}
// 		return rtnVal;
// 	}
// }
// deAllocateHost(hstDrp: CdkDragDrop<any[]>, evt: string): void	{
// 	transferArrayItem(hstDrp.previousContainer.data, hstDrp.container.data, hstDrp.previousIndex, hstDrp.currentIndex)
// 	const hst	= hstDrp.item.data.hostKey;
// 	const host	= hstDrp.item.data;
// 	this.plan.deAllocateHost(hst, host, evt);
// }
// assignGuest	(evt: string, hst: string, gst: string, gstDrp?: CdkDragDrop<any[]>): void {
// 	if (gstDrp) {
// 		const fromHost	= gstDrp.previousContainer.data;
// 		const toHost	= gstDrp.container.data;
// 		const fromIdx	= gstDrp.previousIndex;
// 		const toIdx		= gstDrp.currentIndex;
// 		transferArrayItem(fromHost, toHost, fromIdx, toIdx);
// 		const fromHst	= gstDrp.previousContainer.id;
// 		const toHst		= gstDrp.container.id;
// 		this.plan.rePair(evt, fromHst, toHst, gst);
// 	}
// 	this.plan.assignGuest(evt, hst, gst)
// }
