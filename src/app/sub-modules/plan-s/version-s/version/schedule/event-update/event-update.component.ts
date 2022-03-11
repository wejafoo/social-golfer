

import { environment	} from '../../../../../../../environments/environment';
import { ActivatedRoute	} from '@angular/router';
import { Component		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { Router			} from '@angular/router';
import { Observable		} from 'rxjs';
import { of				} from 'rxjs';
import { switchMap		} from 'rxjs/operators';
import { PlanService	} from '../../../../../services/plan.service';
import { IVersion		} from '../../../../../models/plan';
import { DialogService	} from '../../../../../../services/dialog.service';

@Component({
	selector: 'app-event-plan-list-version-s',
	templateUrl: './event-update.component.html',
	styleUrls: ['./event-update.component.sass']
})
export class EventUpdateComponent implements OnInit {
	e: any;
	d: boolean;
	l: boolean;
	dialog:		DialogService
	eventId:	number;
	loadedVer:	IVersion;
	planId:		number;
	ver:		IVersion;
	versionId:	number;

	constructor (
		public	plan:	PlanService,
		public	route:	ActivatedRoute,
		public	router:	Router
	)			{
		this.e	= environment;
		this.d	= this.e.isDebug;
		this.e	= this.e.isLogs;
		if (this.d) console.log('> EventUpdate');
	}
	ngOnInit () {
		this.route.paramMap.pipe(switchMap(params => of(params.get('planId')))).subscribe(planId => this.planId = +planId)
		this.route.paramMap.pipe(switchMap(params => of( params.get('versionId')))).subscribe(
			versionId => {
				this.loadedVer	= this.plan.version;
				this.ver		= this.plan.version;
		});
		this.route.paramMap.pipe(switchMap(params => of( params.get('eventId')))).subscribe(eventId => this.eventId = +eventId)
	}
	cancel()	{}
	save()		{
		this.loadedVer = JSON.parse( JSON.stringify(this.ver));
		// this.plan.addVersion(this.ver);
		// this.ps.updateVersion( this.ver );
	}
	toPlan()	{
		this.router.navigate(['/plan', this.planId, 'update', 'event', this.eventId]).then()
	}
	toPlans()	{
		this.router.navigate(['/plan/s']).then()
	}
	canDeactivate(): Observable<boolean> | boolean {
		if ( JSON.stringify(this.ver) === JSON.stringify(this.loadedVer)) {
			return true
		} else { return this.dialog.confirm('Abandon changes?')}}
}
