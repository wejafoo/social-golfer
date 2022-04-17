

import { environment		} from '../../../environments/environment';
import { Injectable			} from '@angular/core';
import { Router				} from '@angular/router';
import { BehaviorSubject	} from 'rxjs';
import { PresbyService		} from './presby.service';
import { IEvent				} from '../models/plan';
import { IPlan				} from '../models/plan';
import { IVersion			} from '../models/plan';
import { Plans				} from '../models/plan';
import { Events				} from '../models/plan';
import { PLANS				} from '../models/mock-plans';

// import { Presby } from '../models/roster';

@Injectable({providedIn: 'root'})
export class PlanService {
	e:	   any;
	d:	    boolean;
	l:       boolean;
	events:   Events;
	loaded:	   IPlan;
	version:    IVersion;
	planSubject: BehaviorSubject<Plans>;
	plans:		  Plans	= [];
	versions:  	   IVersion[] = [];
	nextPlanId	= 100;
	nextEventId	= 100;

	// actives: Array<Presby> = [];
	
	constructor(
		public presby: PresbyService,
		public router: Router
	) {
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (window.localStorage.getItem('plans') === null) {
			this.plans = PLANS;
			window.localStorage.setItem('plans', JSON.stringify(this.plans));
		}
		this.plans			= JSON.parse(window.localStorage.getItem('plans')!) || this.addPlan();
		this.planSubject	= new BehaviorSubject<Plans>(this.plans);
	}
	addEvent		(planID: number, name: string):	number		{
		name = name.trim();
		const event: IEvent = {id: ++this.nextEventId, name};
		this.version.events.push(event);
		this.planSubject.next(this.plans);
		return this.nextEventId;
	}
	addPlan			(name?: string):				number		{
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
	addVersion		(fromVersionId: number):		number		{
		const nextLatestVersionId: number	= this.loaded.versions.length;
		const prevLatestVersionId: number = this.loaded.versions.length - 1;
		if (this.d) console.log('\t> PlanService > addVersion() > using:', fromVersionId, 'to create:', nextLatestVersionId);
		if (this.loaded) {
			if (this.d) console.log('\t\t\tBEFORE - Versions:', JSON.parse( JSON.stringify(this.loaded.versions)));
			
			const tmpVersion = JSON.parse( JSON.stringify(this.loaded.versions)).slice(fromVersionId, fromVersionId + 1);
			tmpVersion[0].id = nextLatestVersionId;
			this.loaded.versions.push(...tmpVersion);
			this.loaded.versions[prevLatestVersionId].labels = this.loaded.versions[prevLatestVersionId].labels.filter(item => item !== 'latest');
			
			if (this.d) console.log('\t\t\tAFTER - Versions:',  JSON.parse( JSON.stringify(this.loaded.versions)));
			this.setVersion(nextLatestVersionId);
		} else {
			this.addPlan()
		}
		
		this.events		= this.version.events;
		
		return nextLatestVersionId;
	}
	getVersion		():								IVersion	{
		return this.version;
	}
	rmEvent			(eventId: number):				void		{
		const eventIndex = this.version.events.findIndex(event => event.id === eventId);
		if ( eventIndex !== -1 ) this.version.events.splice(eventId, 1);
		this.planSubject.next(this.plans);
	}
	rmPlan			(id: number):					void		{
		const itemToRemoveIndex = this.plans.findIndex(plan => plan.id === id);
		if (itemToRemoveIndex !== -1) this.plans.splice(itemToRemoveIndex, 1);
		this.planSubject.next(this.plans);
	}
	persistCurVer	():								void		{
		// Todo: write this.version to local storage
	}
	setVersion		(versionId: number):			IVersion	{
		this.version = this.loaded.versions[versionId];
		this.version.labels.push('latest');
		if (this.d) console.log('\t> PlanService > setVersion() > Applying "latest" label to version:', versionId);
		if (this.d) console.log('\t> PlanService > setVersion() > Version:', versionId, 'now active', this.version);
		return this.version;
	}
}

// rmVer			(versionId: number):			boolean		{
// 	const planIdx = this.plans.findIndex(plan => plan.id === this.plan!.id);
// 	this.plans[planIdx].versions.splice(versionId, 1);
// 	this.versions.splice(versionId, 1);
// 	this.planSubject.next(this.plans);
// 	return this.versions.findIndex(version => version.id === versionId) === -1;
// }
