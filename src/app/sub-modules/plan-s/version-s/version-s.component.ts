

import { environment	} from '../../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { PlanService	} from '../../services/plan.service';
import { PresbyService	} from '../../services/presby.service';
import { IPlan			} from '../../models/plan';
import { ISchedule		} from '../../models/plan';

import isObject from 'subscriptions-transport-ws/dist/utils/is-object';

@Component({
	templateUrl: './version-s.component.html',
	styleUrls: ['../plan-s.component.sass']
})

export class VersionsComponent implements OnInit {
	e:     any;
	d:      boolean;
	l:       boolean;
	planId:   number;
	versionId: number;
	loadedPlan: IPlan;
	schedule:	 ISchedule;
	
	constructor (
		public	plan:	PlanService,
		public	presby:	PresbyService,
		private	route:	ActivatedRoute,
		private	router:	Router
	) {
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
	}
	ngOnInit():		void {
		this.route.params.subscribe(params => {
			if (this.d) console.log('\t\t>> Versions > params:', params);
			this.planId		= params.planId;
			this.versionId	= params.versionId;
			this.loadedPlan = this.plan.plan;
			if (this.d) console.log('\t\t>> Versions > load plan:', this.planId, this.loadedPlan);
		})
	}
	addVersion():	void {
		const verId	= this.plan.versions.length;
		const ver	= {id: verId, labels: ['new'], events: []};
		this.plan.versions.push(ver);
	}
	save():			void {
		this.router.navigate(['/plan', 's', this.plan.plan.id]).then();
	}
	createSchedule	(versionId: number):	void {
		const goodVersion = this.plan.addVersion(versionId)
		if (this.d) console.log('\t\t>> Versions > createSchedule() > Version:', versionId, '...validated version:', goodVersion);
		this.router.navigate(['/plan', this.planId, 'version', goodVersion]).then()
	}
	loadSchedule	(versionId: number):	void {
		const goodVersion = this.plan.addVersion(versionId)
		if (this.d) console.log('\t\t>> Versions > loadSchedule() > Version:', versionId, '...validated version:', goodVersion);
		this.router.navigate(['/plan', this.planId, 'version', goodVersion]).then()
	}
	rmVersion		(rmVersionId: number):	void {
		const rmIndex = this.plan.versions.findIndex(version => version.id === rmVersionId);
		if ( rmIndex !== -1 ) this.plan.versions[this.versionId].events.splice(rmIndex, 1);
		this.save();
	}
	deepEqual		(object1: any, object2: any):	boolean	{
		const keys1 = Object.keys(object1);
		const keys2 = Object.keys(object2);
		let rtnVal = false
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
