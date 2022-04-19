
import { environment	} from '../../../../environments/environment';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanService	} from '../../services/plan.service';

@Component({
	selector: 'app-plan-host-detail',
	templateUrl: './plan-detail.component.html',
	styleUrls: ['./plan-detail.component.sass']
})
export class PlanDetailComponent implements OnInit {
	e: any;
	d:   boolean;
	l:     boolean;
	planId:	 number;
	
	constructor (
		public	plan:	PlanService,
		private	route:	ActivatedRoute
	)					{
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t\t\t>>> PlanDetail');
	}
	ngOnInit(): void	{
		this.route.params.subscribe(params => {
			if (this.d) console.log('\t\t\t>>> PlanDetail > params:', params);
			this.planId		= params.planId;
			this.plan.loaded	= this.plan.plans[this.planId];
		})
	}
}
