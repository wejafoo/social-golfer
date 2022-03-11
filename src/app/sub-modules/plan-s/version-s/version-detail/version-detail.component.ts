

import { environment	} from '../../../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { IVersion		} from '../../../models/plan';
import { PlanService	} from '../../../services/plan.service';

@Component({
	selector: 'app-version-host-detail',
	templateUrl: './version-detail.component.html',
	styleUrls: ['./version-detail.component.sass']
})

export class VersionDetailComponent implements OnInit {
	e: any;
	d: boolean;
	l: boolean;
	loadedVer:	IVersion;
	planId:		number;
	versionId:	number;

	constructor (
		public	plan:	PlanService,
		private	route:	ActivatedRoute,
	) {
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
	}
	
	ngOnInit () {
		this.route.params.subscribe(params => {
			if (this.d) console.log('\t\t\t>>> VersionDetail > params:', params);
			this.planId		= params.planId;
			this.versionId	= params.versionId;
			this.loadedVer = this.plan.setVersion(this.versionId);
		})
	}
}
