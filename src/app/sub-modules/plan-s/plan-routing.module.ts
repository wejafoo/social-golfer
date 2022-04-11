

import { NgModule				} from '@angular/core';
import { RouterModule			} from '@angular/router';
import { Routes					} from '@angular/router';
import { EventListComponent		} from './version-s/version/event/event-list/event-list.component';
import { EventDetailComponent	} from './version-s/version/event/event-detail/event-detail.component';
import { EventUpdateComponent	} from './version-s/version/scheduler/event-update/event-update.component';
import { PlanDetailComponent	} from './plan-detail/plan-detail.component';
import { PlansComponent			} from './plan-s.component';
import { VersionsComponent		} from './version-s/version-s.component';
import { VersionDetailComponent	} from './version-s/version-detail/version-detail.component';
import { SchedulerComponent		} from './version-s/version/scheduler/scheduler.component';
import { AuthGuard				} from '../../_guards/auth.guard';

const planRoutes: Routes = [{path: '', children: [
	{path: 's',	component: PlansComponent, children: [{path: ':planId', component: PlanDetailComponent, canActivate: [AuthGuard]}]},
	{path: ':planId',	canActivate: [AuthGuard],	children: [
		{path: 'version', children: [
			{path: 's',				component: VersionsComponent,	children: [{path: ':versionId', component: VersionDetailComponent}]},
			{path: ':versionId',	component: SchedulerComponent,	children: [
				{path: 'event', children: [
					{path: 's',			component: EventListComponent, children: [{path: ':eventId', component: EventDetailComponent}]},
					{path: ':eventId',	component: EventUpdateComponent}]}]}]}]},
	{path: '', redirectTo: '/plan/s', pathMatch: 'full'}
]}];

@NgModule({ imports: [RouterModule.forChild(planRoutes)], exports: [RouterModule]})
export class PlanRoutingModule {}
