

import { environment	} from '../../../environments/environment';
import { Injectable		} from '@angular/core';
import { CdkDragDrop	} from '@angular/cdk/drag-drop';
import { PlanService	} from './plan.service';
import { PresbyService	} from './presby.service';
import { Guests			} from '../models/roster';
import { Hosts			} from '../models/roster';
import { Presbies		} from '../models/roster';
import { ISchedule		} from '../models/plan';

@Injectable({providedIn: 'root'})
export class ScheduleService implements ISchedule {
	e: any;
	d: boolean;
	l: boolean;
	actives: Presbies;
	aHs:  {[key: string]: Hosts } = {};
	unGs:  {[key: string]: Guests } = {};
	unHs:   {[key: string]: Hosts  } = {};
	summary: {[key: string]: any    } = {};
	
	constructor(
		public plan:	PlanService,
		public presby:	PresbyService
	)									{
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		this.actives = presby.presbies.filter(p => p.isActive);
		for (const event of plan.events) {
			const evt = event.name;
			this.aHs[evt]	= <Hosts>[];
			this.unHs[evt]	= <Hosts>[];
			this.unGs[evt]	= <Guests>[];
		}
	}
	calcTotals			():			void	{
		for (const event of this.plan.events) {
			const evt = event.name;
			this.summary[evt].assigned = [];
			this.summary[evt].unAllocatedSeatCnt  = 0;
			this.summary[evt].unAssignedGuestCnt = 0;
			this.summary[evt].allocatedSeatCnt  = 0;
			this.summary[evt].assignedGuestCnt = 0;
			this.summary[evt].assignedSeatCnt = 0;
			for (const gst of this.unGs[evt]) { this.summary[evt].unAssignedGuestCnt += gst.cnt }
			for (const hst of this.unHs[evt]) { this.summary[evt].unAllocatedSeatCnt += hst.seats }
			for (const host of this.aHs[evt]) {
				const hst = host.hostKey;
				this.summary[evt].allocatedSeatCnt		  += host.seats;
				this.summary[evt].hosts[hst].assigned	    = [];
				this.summary[evt].hosts[hst].assignedSeatCnt = 0;
				this.summary[evt].hosts[hst].assignedGuestCnt = 0;
				for (const guest of host.assigned) {
					this.summary[evt].assigned.push(...guest.guests);
					this.summary[evt].assignedGuestCnt	+= guest.guests.length;
					this.summary[evt].assignedSeatCnt	+= guest.guests.length;
					this.summary[evt].hosts[hst].assigned.push(...guest.guests);
					this.summary[evt].hosts[hst].assignedGuestCnt 	+= guest.guests.length;
					this.summary[evt].hosts[hst].assignedSeatCnt  	+= guest.guests.length;
			}}
			this.summary[evt].overAllocatedSeats = this.summary[evt].allocatedSeatCnt - this.summary[evt].rsvps;
			this.summary[evt].overAssignedGuests = this.summary[evt].assignedGuestCnt - this.summary[evt].allocatedSeatCnt;
			this.summary[evt].nextHostCnt = 0;
			for (const host of this.aHs[evt]) {
				const hst = host.hostKey;
				this.summary[evt].hosts[hst].overAllocatedSeats = this.summary[evt].hosts[hst].assignedSeatCnt - this.summary[evt].hosts[hst].seats;
				if (this.summary[evt].hosts[hst].overAllocatedSeats < 0) {
					this.summary[evt].hosts[hst].unAssignedSeatCnt = this.summary[evt].hosts[hst].overAllocatedSeats * -1
				} else { this.summary[evt].hosts[hst].unAssignedSeatCnt = 0 }
				if (this.summary[evt].hosts[hst].unAssignedSeatCnt > this.summary[evt].nextHostCnt) {
					this.summary[evt].nextHostCnt = this.summary[evt].hosts[hst].unAssignedSeatCnt;
					this.summary[evt].nextHost = hst;
	}}}}
	loadEvent			(evt: string):	void	{
		this.loadActiveHosts(evt);
		this.loadActiveGuests(evt);
		this.initEventSummary(evt);
	}
	loadActiveHosts		(evt: string):		void	{
		for (const active of this.actives) {
			const hostings = JSON.parse('[' + active.hostings + ']');
			const activeObj = Object.assign({}, active);
			let hCnt = 0;
			for (const hosting of hostings) {
				const hostingObj = Object.assign({}, hosting);
				if (hostingObj.event === evt) {
					hostingObj.id = JSON.parse(JSON.stringify(activeObj.id));
					hostingObj.hostName = activeObj.last;
					hostingObj.isDisabled = false;
					hostingObj.hostKey = activeObj.last + '-' + activeObj.id + '-' + activeObj.seats + '-' + activeObj.guests.length;
					if (!('seats' in hostingObj) || hostingObj.seats === null) {
						hostingObj.seats = activeObj.seats
					}
					if (!('guests' in hostingObj)) {
						hostingObj.guests = JSON.parse(JSON.stringify(activeObj.guests))
					}
					this.unHs[evt].push(hostingObj);
				}
				hCnt++;
			}
		}
	}
	loadActiveGuests	(evt: string):			void	{
		if (this.d) console.log('\t\t\tGuests from:', this.actives.length, 'actives');
		for (const active of this.actives) {
			let gCnt = 0;
			const guestings = JSON.parse('[' + active.guestings + ']');
			const activeObj = Object.assign({}, active);
			for (const guesting of guestings) {
				const guestingObj = Object.assign({}, guesting);
				if (guestingObj.event === evt) {
					if (!('cnt' in guestingObj) || guestingObj.cnt === null) { guestingObj.cnt = activeObj.guests.length }
					if (!('guests' in guestingObj)) { guestingObj.guests = activeObj.guests }
					guestingObj.isDisabled	= false;
					guestingObj.id			= JSON.parse(JSON.stringify(activeObj.id));
					guestingObj.partyName	= JSON.parse(JSON.stringify(activeObj.last));
					guestingObj.guestKey	= activeObj.last + '-' + activeObj.id + '-' + activeObj.seats + '-' + activeObj.guests.length;
					this.unGs[evt].push(guestingObj);
				}
				gCnt++;
	}}}
	initEventSummary	(evt: string):				void	{
		this.summary[evt] = {																		// init event summary
			assigned: [], hosts: {}, rsvps: 0, seats: 0, assignedSeatCnt: 0,
			allocatedSeatCnt: 0, unAllocatedSeatCnt: 0, overAllocatedSeats: 0,
			assignedGuestCnt: 0, unAssignedGuestCnt: 0, overAssignedGuests: 0
		}
		for (const gst of this.unGs[evt]) { this.summary[evt].rsvps += gst.guests.length }			// init guest summary
		for (const host of this.unHs[evt]) {														// init host summary
			const hst = host.hostKey;
			this.summary[evt].seats += host.seats;
			this.summary[evt].hosts[hst] = {
				hosts:		[...host.guests],
				seats:			host.seats,
				isAllocated:		false,
				assignedSeatCnt:		0
	}}}
	deAllocateHost		(evt: string, unHstIdx: number): boolean {
		console.log('\t> Schedule > deAllocateHost()...', evt, unHstIdx);
		const unHostObj = this.unHs[evt][unHstIdx];
		const unHostKey = unHostObj.hostKey;
		for (const guestStrIdx in unHostObj.assigned) {
			if (Object.prototype.hasOwnProperty.call(unHostObj.assigned, guestStrIdx)) {
				const guestIdx = parseInt(guestStrIdx, 10)
				this.deAssignGuest(evt, unHstIdx, guestIdx, true);
			}
		}
		
		delete this.summary[evt].hosts[unHostKey].overAllocatedSeats;
		delete this.summary[evt].hosts[unHostKey].unAssignedSeatCnt;
		
		this.summary[evt].hosts[unHostKey].isDisabled	= false;
		this.summary[evt].hosts[unHostKey].isAllocated	= false;
		
		for (const event of this.plan.events) {
			const e = event.name;
			for (const h in this.unHs[e]) {
				if (this.unHs[e][h].hostKey === unHostKey) {
					this.unHs[e][h].isDisabled = false;
					break
				}
			}
		}
		return true
	}
	allocateHost		(evt: string, hstIdx: number | undefined, hostDrop?: CdkDragDrop<any[]>): void {
		let allocIdx: number;
		if (hostDrop) { allocIdx = hostDrop.currentIndex } else { allocIdx = this.aHs[evt].push(...this.unHs[evt].splice(hstIdx, 1)) - 1 }
		const hst = this.aHs[evt][allocIdx].hostKey;
		this.aHs[evt][allocIdx].assigned = [];
		this.summary[evt].hosts[hst].isAllocated = true;
		for (const event of this.plan.events) {									// disable other events for allocated host
			const e = event.name;
			if (e !== evt) {
				for (const h in this.unHs[e]) {
					if (this.unHs[e][h].hostKey === hst)
						this.unHs[e][h].isDisabled = true
				}
			}
		}
		this.assignGuest(evt, hst, hst);
	}
	deAssignGuest		(evt: string, hstIdx: number, gstIdx: number, viaDeAllocation?: boolean):	void {
		let unGstIdx: number;
		if (viaDeAllocation) {
			unGstIdx = this.unGs[evt].push(...this.unHs[evt][hstIdx].assigned.splice(gstIdx, 1)) - 1;
			this.rePair(evt, hstIdx, undefined, unGstIdx, viaDeAllocation);
		} else {
			unGstIdx = this.unGs[evt].push(...this.aHs[evt][hstIdx].assigned.splice(gstIdx, 1)) - 1;
			this.rePair(evt, hstIdx, undefined, unGstIdx);
		}
		this.calcTotals()
	}
	assignGuest			(evt: string, hst: string | undefined, gst: string | undefined, guestDrop?: CdkDragDrop<any[]>): boolean {
		if (this.d) console.log('\t\t> Schedule > assignGuest()', evt, '\t', hst, '\t', gst, '\t', guestDrop);
		let success = false;
		let hstIdx:	number;
		let gstIdx:	 number;
		let unGstIdx: number;
		if ((hst === undefined || gst === undefined) && !guestDrop) {
			console.log('!!! FAIL -- The absence of a drop object requires supplied values for -- host id:', hst, ', and guest id:', gst);
		} else {
			if (guestDrop) {													// USER DROP -- ACCEPTS ALL DROP LISTS
				hst	= guestDrop.container.id;
				gst	= guestDrop.item.data['guestKey'];
				// this.rePair(evt, undefined, hstIdx, unGstIdx, false);
				success	= true
			} else {															// AUTO ASSIGN --  ACCEPTS FROM ONLY UNASSIGNED DROP LIST
				hstIdx	= this.aHs	[evt].findIndex(h => h.hostKey	=== hst);
				unGstIdx	= this.unGs	[evt].findIndex(g => g.guestKey === gst);
				if (hst === gst) {
					const toGuestIdx = this.aHs[evt][hstIdx].assigned.push(...this.unGs[evt].splice(unGstIdx, 1)) - 1;
					this.aHs[evt][hstIdx].isDisabled = true;
					this.aHs[evt][hstIdx].assigned[toGuestIdx].isDisabled = true;
					success = true;
				} else {
					let tmpCount = 0;
					let pair1: string;
					let pair2: string;
					if (this.aHs[evt][hstIdx].assigned.every(aG => {
						tmpCount++;
						pair1 = gst;
						pair2 = aG.guestKey;
						return this.summary.pairs[gst].includes(aG.guestKey)
					})) {
						gstIdx = this.aHs[evt][hstIdx].assigned.push(...this.unGs[evt].splice(unGstIdx, 1)) - 1;
						this.rePair(evt, undefined, hstIdx, gstIdx);
						success = true;
					} else {
						console.log('!!! INVALID ASSIGNMENT -- failed ' + evt + ' pairing validation:', pair1 + ' --> ' + pair2);
						success = false;
		}}}}
		if (success) this.calcTotals();
		return success
	}
	rePair				(evt: string, unHstIdx: number|undefined, hstIdx: number|undefined, gstIdx: number, viaDeAllocation?: boolean):	void {
		if (viaDeAllocation) { console.log('rePair() -> via de-allocation', evt, unHstIdx, hstIdx, gstIdx) } else {
			if (unHstIdx !== undefined) {
				for (const guest of this.aHs[evt][hstIdx].assigned) {
					if (this.aHs[evt][hstIdx].assigned[gstIdx].guestKey !== guest.guestKey) {
						this.summary.pairs[guest.guestKey].push(this.aHs[evt][hstIdx].assigned[gstIdx].guestKey);
						this.summary.pairs[this.aHs[evt][hstIdx].assigned[gstIdx].guestKey].push(guest.guestKey);
			}}}
			if (hstIdx !== undefined) {
				for (const guest of this.aHs[evt][hstIdx].assigned) {
					const toGst	= this.aHs[evt][hstIdx].assigned[gstIdx].guestKey;
					if (toGst !== guest.guestKey) {
						this.summary.pairs[toGst].splice(this.summary.pairs[toGst].indexOf(guest.guestKey), 1);
						this.summary.pairs[guest.guestKey].splice(this.summary.pairs[guest.guestKey].indexOf(toGst), 1);
	
		}}}}
		// console.log('\t\t> Schedule >\t\trePair()', evt, unHstIdx, hstIdx, gstIdx, viaDeAllocation, '-- SUCCESS!');
	}
}
