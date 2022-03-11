

import { environment		} from '../../../environments/environment';
import { Injectable			} from '@angular/core';
import { Router				} from '@angular/router';
import { CdkDrag			} from '@angular/cdk/drag-drop';
import { CdkDragDrop		} from '@angular/cdk/drag-drop';
import { CdkDropList		} from '@angular/cdk/drag-drop';
import { moveItemInArray	} from '@angular/cdk/drag-drop';
import { BehaviorSubject	} from 'rxjs';
import { PresbyService		} from './presby.service';
import { ScheduleService	} from './schedule.service';

import { IEvent		} from '../models/plan';
import { IPlan		} from '../models/plan';
import { ISchedule	} from '../models/plan';
import { IVersion	} from '../models/plan';
import { Plans		} from '../models/plan';
import { Events		} from '../models/plan';
import { Presby		} from '../models/roster';
import { PLANS		} from '../models/mock-plans';

@Injectable({providedIn: 'root'})
export class PlanService {
	e: any;
	d: boolean;
	l: boolean;
	
	actives:	Array<Presby> = [];
	events:		Events;
	plan:		IPlan;
	plans: 		Plans = [];
	schedule:	ISchedule;
	summary:	{[key: string]: any	} = {};
	version:	IVersion;
	versions:	IVersion[] = [];
	planSubject: BehaviorSubject<Plans>;
	
	nextPlanId	= 100;
	nextEventId	= 100;
	
	constructor(
		public presby: PresbyService,
		public router: Router
	) {
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t> PlanService');
		if (localStorage.getItem('plans') === null) {
			this.plans = PLANS;
			localStorage.setItem('plans', JSON.stringify(this.plans));
		}
		this.plans = JSON.parse(localStorage.getItem('plans')!) || this.addPlan();				// const addRoute = ['/plan', this.plans.length, 'version', 's', '0']	// this.router.navigate(addRoute).then();
		this.planSubject = new BehaviorSubject<Plans>(this.plans);
	}
	addVersion		(fromVersionId: number): number {
		const nextLatestVersionId: number	= this.plan.versions.length;
		const prevLatestVersionId: number = this.plan.versions.length - 1;
		if (this.d) console.log('\t> PlanService > addVersion() > using:', fromVersionId, 'to create:', nextLatestVersionId);
		if (this.plan) {
			if (this.d) console.log('\t\t\tBEFORE - Versions:', JSON.parse( JSON.stringify(this.plan.versions)));
			
			const tmpVersion = JSON.parse( JSON.stringify(this.plan.versions)).slice(fromVersionId, fromVersionId + 1);
			tmpVersion[0].id = nextLatestVersionId;
			this.plan.versions.push(...tmpVersion);
			this.plan.versions[prevLatestVersionId].labels = this.plan.versions[prevLatestVersionId].labels.filter(item => item !== 'latest');
			
			if (this.d) console.log('\t\t\tAFTER - Versions:',  JSON.parse( JSON.stringify(this.plan.versions)));
			this.setVersion(nextLatestVersionId);
		} else {
			this.addPlan()
		}
		
		this.events		= this.version.events;
		this.schedule	= new ScheduleService(this.presby.presbies, this.events);
		
		return nextLatestVersionId;
	}
	setVersion		(versionId: number): IVersion {
		this.version = this.plan.versions[versionId];
		this.version.labels.push('latest');
		if (this.d) console.log('\t> PlanService > setVersion() > Applying "latest" label to version:', versionId);
		if (this.d) console.log('\t> PlanService > setVersion() > Version:', versionId, 'now active', this.version);
		return this.version;
	}
	
	
	calcTotals		(): void {
		for (const event of this.events) {
			const evt = event.name
			this.summary[evt].guests				= [];
			this.summary[evt].unAllocatedSeatCnt	= 0;
			this.summary[evt].unAssignedGuestCnt	= 0;
			this.summary[evt].allocatedSeatCnt		= 0;
			this.summary[evt].assignedGuestCnt		= 0;
			for (const gst of this.schedule.unGs[evt])	{ this.summary[evt].unAssignedGuestCnt	+= gst.cnt}
			for (const hst of this.schedule.unHs[evt])	{ this.summary[evt].unAllocatedSeatCnt	+= hst.seats}
			for (const hst of this.schedule.aHs[evt])	{ this.summary[evt].allocatedSeatCnt	+= hst.seats}
			for (const hst in this.schedule.aGs[evt]) {
				if (this.schedule.aGs[evt].hasOwnProperty(hst)) {
					this.summary[evt][hst].guests			= [];
					this.summary[evt][hst].assignedSeatCnt	= 0;
					for (const gst of this.schedule.aGs[evt][hst].guests) {
						this.summary[evt].guests.push(...gst);
						this.summary[evt][hst].guests.push(...gst);
					}
					for (const gst of this.schedule.aGs[evt][hst].guests) {
						this.summary[evt].assignedGuestCnt += gst.length
						this.summary[evt][hst].assignedSeatCnt += gst.length
					}
				}
			}
			this.summary[evt].overAllocatedSeats	= this.summary[evt].allocatedSeatCnt - this.summary[evt].rsvps;
			this.summary[evt].overAssignedGuests	= this.summary[evt].assignedGuestCnt - this.summary[evt].allocatedSeatCnt;
			this.summary[evt].nextHostCnt			= 0;
			this.summary[evt].nextHost				= '<undefined>';
			for (const hst in this.schedule.aGs[evt]) {
				if (this.schedule.aGs[evt].hasOwnProperty(hst)) {
					this.summary[evt][hst].overAllocatedSeats =
						this.summary[evt][hst].assignedSeatCnt - this.summary[evt][hst].seats;
					if (this.summary[evt][hst].overAllocatedSeats < 0) {
						this.summary[evt][hst].unAssignedSeatCnt = this.summary[evt][hst].overAllocatedSeats * -1
					} else {
						this.summary[evt][hst].unAssignedSeatCnt = 0
					}
					if (this.summary[evt][hst].unAssignedSeatCnt > this.summary[evt].nextHostCnt) {
						this.summary[evt].nextHostCnt = this.summary[evt][hst].unAssignedSeatCnt;
						this.summary[evt].nextHost = hst;
					}
				}
			}
		}
	}
	getVersion		(): IVersion {
		return this.version;
	}
	deAllocateHost	(hst: string, host: any, evt: string): boolean {
		const unGuests	= this.schedule.aGs[evt][hst];
		while ( unGuests.length > 0 ) {
			if (unGuests[0].guestKey === hst) { unGuests[0].isDisabled = false }
			this.deAssignGuest(evt, hst, unGuests[0].guestKey, 0)
		}
		host.isDisabled						= false;
		this.summary[evt][hst].isDisabled	= false;
		this.summary[evt][hst].isAllocated	= false;
		this.summary[evt][hst].guests		=
			JSON.parse( JSON.stringify(this.summary[evt][hst].hosts));
		delete this.summary[evt][hst].overAllocatedSeats;
		delete this.summary[evt][hst].unAssignedSeatCnt;
		delete this.schedule.aGs[evt][hst];
		
		for ( const event of this.events ) {
			const e = event.name;
			for ( const h in this.schedule.unHs[e] ) {
				if ( this.schedule.unHs[e][h].hostKey === hst ) {
					this.schedule.unHs[e][h].isDisabled = false
				}
			}
		}
		return true;
	}
	dropHost		(hstDrp: CdkDragDrop<any[]>, evt: string): void {
		////////////////////////////////////////////////////////  DROP EVENTS //
		if (hstDrp.previousContainer === hstDrp.container) {
			if (this.l) {console.log('PLAN:', this.schedule, '\nSUMMARY:', this.summary)}
			moveItemInArray(hstDrp.container.data, hstDrp.previousIndex, hstDrp.currentIndex);
		} else {
			const hostIdx = hstDrp.previousIndex;
			const hostKey = hstDrp.previousContainer.data[hostIdx].hostKey;
			this.allocateHost(evt, hostKey, hostIdx);
		}
	}
	unDropHost		(hstDrp: CdkDragDrop<any[]>, evt: string): void {
		const fromHost	= hstDrp.previousContainer;
		const toHost	= hstDrp.container;
		if (fromHost === toHost) {
			moveItemInArray(hstDrp.container.data, hstDrp.previousIndex, hstDrp.currentIndex)
		}
		const hst	= hstDrp.item.data.hostKey;
		const host	= hstDrp.item.data;
		this.deAllocateHost(hst, host, evt);
	}
	assignGuest		(evt: string, hst: string, gst: string): boolean {
		let success = false;
		if (hst === gst) {
			const fromIdx = this.schedule.unGs[evt].findIndex(guest => guest.guestKey === gst);
			if (fromIdx < 0 ) {
				for (const [host/*,hostArray*/] of Object.entries(this.schedule.aGs[evt])) {
					const oldIdx = this.schedule.aGs[evt][host].findIndex(
						(guest: { guestKey: string; }) => guest.guestKey === hst
					)
					if (oldIdx >= 0) {
						const newGuestIdx = this.schedule.aGs[evt][hst].push(
							...this.schedule.aGs[evt][host].splice(oldIdx, 1)
						) - 1;
						this.schedule.aGs[evt][hst][newGuestIdx].isDisabled = true;
					}
				}
			} else {
				const newGuestIdx = this.schedule.aGs[evt][hst].push(
					...this.schedule.unGs[evt].splice(fromIdx, 1)
				) - 1;
				this.schedule.aGs[evt][hst][newGuestIdx].isDisabled = true;
				success = true;
			}
		} else {
				///////////////////////////////////  MANUAL GUEST ASSIGNMENTS //
				if (
					this.schedule.aGs[evt][hst].every((aG: {guestKey: string}) =>
						this.summary['pairs'][gst].includes(aG.guestKey))
				) {
					let fromHst: string;
					let toIdx: number;
					let fromIdx = this.schedule.unGs[evt].findIndex(
						guest => guest.guestKey === gst
					);
					if (fromIdx < 0) {
						///////////////////////////////////////  host -> host //
						for (const host of this.schedule.aGs[evt]) {
							fromHst	= host.guestKey;
							fromIdx	= this.schedule.aGs[evt][host.guestKey].findIndex((guest: any) => guest.guestKey === gst);
							if (fromIdx > 0) {
								toIdx = this.schedule.aGs[evt][hst].push(...this.schedule.aGs[evt][fromHst].splice(fromIdx, 1))
								this.rePair(evt, fromHst, hst, gst);
								success = true;
								break
							}
						}
					} else {
						/////////////////////////////////  unassigned -> host //
						this.schedule.aGs[evt][hst].push(
							...this.schedule.unGs[evt].splice(fromIdx, 1)
						)
						this.rePair(evt, 'unassigned', hst, gst);
						success = true;
					}
				} else { success = false }
		}
		
		this.calcTotals();
		return success
	}
	dropGuest		(gstDrp: CdkDragDrop<any[]>, evt: string): void {
		const fromHst	= gstDrp.previousContainer.id;
		const toHst		= gstDrp.container.id;
		const gst		= gstDrp.item.data.guestKey;
		const toHost	= gstDrp.container.data;
		const fromIdx	= gstDrp.previousIndex;
		const toIdx		= gstDrp.currentIndex;
		if (fromHst === toHst) {
			if (this.l) { console.log('PLAN:', this.schedule, '\nSUMMARY:', this.summary)}
			moveItemInArray(toHost, fromIdx, toIdx);
		} else {
			this.assignGuest(evt, toHst, gst)
		}
	}
	unDropGuest		(gstDrp: CdkDragDrop<any[]>, evt: string): void {
		const fromHst	= gstDrp.previousContainer.id;
		const toHst		= gstDrp.container.id;
		const gst		= gstDrp.item.data.guestKey;
		const fromIdx	= gstDrp.previousIndex;
		if (fromHst !== toHst) {
			this.deAssignGuest(evt, fromHst, gst, fromIdx);
		} else {
			if (this.l) {
				console.log('PLAN:', this.schedule, '\nSUMMARY:', this.summary[evt])
			}
		}
	}
	pairsPredicate	(): (gstDrg: CdkDrag, hstDrp: CdkDropList) => any {
		return (gstDrg: CdkDrag, hstDrp: CdkDropList) => {
			const guests: any	= [];
			const gst			= gstDrg.data.guestKey
			guests.push(...hstDrp.data);
			return guests.every((guest: {guestKey: string}) =>
				this.summary['pairs'][gst].includes(guest.guestKey) || hstDrp.id === 'unassigned'
			)
		}
	}
	allocateHost	(evt: string, hst: string, prevHIdx: number): void {
		this.schedule.aHs[evt].push(...this.schedule.unHs[evt].splice(prevHIdx, 1));
		this.summary[evt][hst].isAllocated	= true;
		this.schedule.aGs[evt][hst]			= [];
		for (const event of this.events) {
			const e = event.name;
			if (e !== evt) {
				for (const h in this.schedule.unHs[e]) {
					if (this.schedule.unHs[e][h].hostKey === hst) {
						this.schedule.unHs[e][h].isDisabled = true
					}
				}
			}
		}
		this.assignGuest(evt, hst, hst);
	}
	deAssignGuest	(evt: string, hst: string, gst: string, prevGIdx: number): void {
		this.schedule.unGs[evt].push(...this.schedule.aGs[evt][hst].splice(prevGIdx, 1));
		this.rePair(evt, hst, 'unassigned', gst);
		this.calcTotals()
	}
	rePair			(evt: string, fromHost: string, toHost: string, gst: string): void {
		const fromGuests = this.schedule.aGs[evt][fromHost];
		const toGuests = this.schedule.aGs[evt][toHost];
		if ( fromHost !== 'unassigned' ) {
			for ( const fromGuest of fromGuests ) {
				const fGst = fromGuest.guestKey;
				this.summary['pairs'][fGst].push(gst);
				this.summary['pairs'][gst].push(fGst);
			}}
		if ( toHost !== 'unassigned' ) {
			for (const toGuest of toGuests) {
				const tGst = toGuest.guestKey;
				if (gst !== tGst) {
					this.summary['pairs'][gst].splice(
						this.summary['pairs'][gst].indexOf(tGst), 1
					);
					this.summary['pairs'][tGst].splice(
						this.summary['pairs'][tGst].indexOf(gst), 1
					);
				}
			}
		}
	}
	rmPlan			(id: number): void {
		const itemToRemoveIndex = this.plans.findIndex(plan => plan.id === id);
		if ( itemToRemoveIndex !== -1 ) this.plans.splice(itemToRemoveIndex, 1);
		this.planSubject.next(this.plans);
	}
	addPlan			(name?: string): number	{
		if (name) {
			name = name.trim();
			const newPlan: IPlan = {id: ++this.nextPlanId, name, versions: []};
			this.plans.push(newPlan);
		} else {
			const firstPlan: IPlan = {id: ++this.nextPlanId, name: 'new plan name', versions: []};
			this.plans.push(firstPlan);
		}
		this.planSubject.next(this.plans);
		// this.addVersion({id: 0, labels: ['default', 'new'], events: [{id: 0, name: 'January'}, {id: 1, name: 'February'}, {id: 2, name: 'March'}]});
		return this.nextPlanId;
	}
	rmEvent			(eventId: number): void	{
		const eventIndex = this.version.events.findIndex(event => event.id === eventId);
		if ( eventIndex !== -1 ) this.version.events.splice(eventId, 1);
		this.planSubject.next(this.plans);
	}
	rmVer			(versionId: number): boolean {
		const planIdx = this.plans.findIndex(plan => plan.id === this.plan!.id);
		this.plans[planIdx].versions.splice(versionId, 1);
		this.versions.splice(versionId, 1);
		this.planSubject.next(this.plans);
		return this.versions.findIndex(version => version.id === versionId) === -1;
	}
	addEvent		(planID: number, name: string):	number	{
		name = name.trim();
		const event: IEvent = {id: ++this.nextEventId, name};
		this.version.events.push(event);
		this.planSubject.next(this.plans);
		return this.nextEventId;
	}
	persistCurVer	(): void {
		// Todo: write this.version to local storage
	}
}

// setPlan(planId:	number):	boolean	{
// 	this.plan = this.plans[planId];
// 	return true;
// 	// return this.plans.find(( plan: Plan ) => { if ( plan.id === planId ) { this.plan = plan; return plan } return undefined})
// }
// getEvents(): Events { return this.events }
/*	getPlan(planId: number): Plan {return this.plans.find(( plan: Plan ) => {if ( plan.id === planId ) {this.plan = plan; return plan} // return undefined })}
	updatePlan(update: Plan): void {
		const itemToUpdateIndex = this.plans.findIndex(plan => plan.id === update.id);if ( itemToUpdateIndex !== -1 ) this.plans.splice(itemToUpdateIndex, 1, update);localStorage.setItem('plans', JSON.stringify(this.plans));this.planSubject.next(this.plans)
	}
*/
// newSchedule(planId: number, versionId: number): Version {
// 	if (this.d) console.log('\t> PlanService > setPlanVersion() > ARGS:');
// 	if (this.d) console.log('\t\tPlan ID:', planId);
// 	if (this.d) console.log('\t\tVersion ID:', versionId);
// 	if (this.d) console.log('\t> PlanService > setPlanVersion() > CURRENT:');
// 	this.plan = this.plans.find((plan: Plan) => plan.id === planId);
// 	if (this.d) console.log('\t\tPlan:', this.plan);
// 	this.version = this.plan.versions[versionId];
// 	if (this.d) console.log('\t\tVersion:', this.version);
// 	this.events = this.version.events.map(event => event.name);
// 	if (this.d) console.log('\t\tEvents:', this.events);
//
// 	if (this.d) console.log('\t\tSchedule:', this.schedule);
//
// 	return this.version;
// }
