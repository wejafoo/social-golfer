

import { environment	} from '../../../environments/environment';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { PlanService	} from '../services/plan.service';
import { Plans			} from '../models/plan';
import { Presbies		} from '../models/roster';

@Component({
	templateUrl: './plan-s.component.html',
	styleUrls: ['./plan-s.component.sass'],
})
export class PlansComponent implements OnInit {
	e: any;
	d: boolean;
	l: boolean;
	presbies: Presbies | undefined | null;
	allowAdd				= false;
	planId					= 0;
	@Input() plans: Plans	= [];
	
	constructor (
		public plan:	PlanService,
		public router:	Router
	) 						{
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t\t>> PlansComponent');
	}
	ngOnInit()				{
		this.plan.planSubject.subscribe(plans => {
			if (this.d) console.log('\t\t>> PlansComponent > new plans:', plans);
			this.allowAdd	= true;
			this.plans		= plans;
		})
	}
	addPlan()				{
		const addRoute = ['/plan', this.plans.length, 'version', 's', '0'];
		this.router.navigate(addRoute).then();
	}
	schedLatest(planId: number) 	{
		const addRoute = ['/plan', planId, 'version', 'latest'];
		this.router.navigate(addRoute).then();
	}
	editPlan(planId: number) 	{
		const addRoute = ['/plan', planId, 'version', 's'];
		this.router.navigate(addRoute).then();
	}
	rmPlan(planId: number) 	{
		this.plan.rmPlan(planId);
		this.router.navigate(['/plan/s']).then();
	}
}
