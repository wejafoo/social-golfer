
import { environment			} from '../../environments/environment';
import { Injectable				} from '@angular/core';
import { ActivatedRouteSnapshot	} from '@angular/router';
import { CanActivate			} from '@angular/router';
import { Router					} from '@angular/router';
import { RouterStateSnapshot	} from '@angular/router';
import { PlanService			} from '../sub-modules/services/plan.service';
import { PresbyService			} from '../sub-modules/services/presby.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
	e: any;
	d: boolean;
	l: boolean;
	
	constructor(
		private plan:	PlanService,
		private presby:	PresbyService,
		private router:	Router
	) {
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
	}
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (route.params.planId >= 0) {
			this.plan.plan = this.plan.plans[+route.params.planId];
			if (this.presby.presbies !== undefined) {
				if (this.d) console.log('\t> AuthGuard > Presby Service?', Array.isArray(this.presby.presbies), this.presby.presbies.length);
				return true
			} else {
				console.log('\nDEEP LINKING IS DISCOURAGED... redirecting to PLAN HUB\n\n');
				this.router.navigate(['/plan', 's']).then()
	}}}
}
