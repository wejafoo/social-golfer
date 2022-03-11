

import { environment	} from '../../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { Subscription	} from 'rxjs';
import { PlanService	} from '../../services/plan.service';
import { IPlan			} from '../../models/plan';

@Component({templateUrl: './version-s.component.html', styleUrls: ['../plan-s.component.sass']})
export class VersionsComponent implements OnInit {
	e: any;
	d: boolean;
	l: boolean;
	loadedPlan: IPlan;
	planId: number;
	versionId: number;
	
	constructor (
		public	plan:	PlanService,
		private	route:	ActivatedRoute,
		private	router:	Router
	) {
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
	}
	ngOnInit(): void {
		this.route.params.subscribe(params => {
			if (this.d) console.log('\t\t>> Versions > params:', params);
			this.planId		= params.planId;
			this.versionId	= params.versionId;
			this.loadedPlan = this.plan.plan;
			if (this.d) console.log('\t\t>> Versions > load plan:', this.planId, this.loadedPlan);
		})
	}
	addVersion(): void {
		const verId	= this.plan.versions.length;
		const ver	= {id: verId, labels: ['new'], events: []};
		this.plan.versions.push(ver);
	}
	rmVersion(rmVersionId: number):	void {
		const rmIndex = this.plan.versions.findIndex(version => version.id === rmVersionId);
		if ( rmIndex !== -1 ) this.plan.versions[this.versionId].events.splice(rmIndex, 1);
		this.save();
	}
	loadSchedule(versionId: number): void {
		const goodVersion = this.plan.addVersion(versionId)
		if (this.d) console.log('\t\t>> Versions > loadSchedule() > Version:', versionId, '...validated version:', goodVersion);
		this.router.navigate(['/plan', this.planId, 'version', goodVersion]).then()
	}
	save(): void {
		this.router.navigate(['/plan', 's', this.plan.plan.id]).then();
	}
}
