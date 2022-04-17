
import { environment	  } from '../../../../environments/environment';
import { ActivatedRoute	 } from '@angular/router';
import { Component		} from '@angular/core';
import { OnInit		   } from '@angular/core';
import { Router		  } from '@angular/router';
import { PlanService } from '../../services/plan.service';
import { ISchedule	} from '../../models/plan';

@Component({
	templateUrl: './version-s.component.html',
	styleUrls:  [ './version-s.component.sass' ]
})
export class VersionsComponent implements OnInit {
	e:     any;
	d:      boolean;
	l:       boolean;
	planId:   number;
	versionId: number;
	schedule:   ISchedule;
	
	constructor (
		public	plan: PlanService,
		private	route: ActivatedRoute,
		private	router: Router
	)				{
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
	}
	ngOnInit():		void {
		this.route.params.subscribe(params => {
			if (this.d) console.log('\t\t>> Versions > params:', params);
			this.planId		= params.planId;
			this.versionId	= params.versionId;
			if (this.d) console.log('\t\t>> Versions > loading plan:', this.planId);
			for (const ver of this.plan.loaded.versions) {
				ver.isVerSched = !Boolean(window.localStorage.getItem(String(this.plan.loaded.id) + '-' + ver.id));
				if (this.d) console.log('version #' + ver.id, ':', ver.isVerSched, ver);
			}
		})
	}
	addVersion():		void {
		const verId	= this.plan.versions.length;
		const ver	= {id: verId, labels: ['new'], events: []};
		this.plan.versions.push(ver);
	}
	goBack():		 		void {
		this.router.navigate(['/plan', 's']).then();
	}
	save():						void {
		this.router.navigate(['/plan', 's', this.plan.loaded.id]).then();
	}
	rmVersion(vid: number):	void {
		const pid	 = this.plan.loaded.id;
		const planIdx = this.plan.plans.findIndex(plan => plan.id === pid);
		const verIdx   = this.plan.plans[planIdx].versions.findIndex(version => version.id === vid);
		console.log('Loaded plan:', this.plan.loaded, 'removing version:', planIdx + '-' + verIdx, this.plan.plans);
		if (verIdx > 0) {
			this.plan.plans[planIdx].versions.splice(verIdx, 1);
			this.plan.loaded.versions.splice(verIdx, 1);
		}
		this.save();
	}
	loadSchedule(versionId:	number):	void {
		const goodVersion = this.plan.addVersion(versionId)
		if (this.d) console.log('\t\t>> Versions > loadSchedule() > Version:', versionId, '...validated version:', goodVersion);
		this.router.navigate(['/plan', this.planId, 'version', goodVersion]).then()
	}
	schedVersion(versionId: number):		void {
		const goodVersion = this.plan.addVersion(versionId)
		if (this.d) console.log('\t\t>> Versions > schedVersion() > Version:', versionId, '...validated version:', goodVersion);
		this.router.navigate(['/plan', this.planId, 'version', goodVersion]).then()
	}
}
