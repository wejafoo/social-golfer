
import { NgModule				} from '@angular/core';
import { CommonModule			 } from '@angular/common';
import { FormsModule			  } from '@angular/forms';
import { MatDialogModule		   } from '@angular/material/dialog';
import { MAT_DIALOG_DEFAULT_OPTIONS	} from '@angular/material/dialog';
import { EventDetailComponent		} from './version-s/version/event/event-detail/event-detail.component';
import { EventListComponent			} from './version-s/version/event/event-list/event-list.component';
import { SchedulerComponent			} from './version-s/version/scheduler/scheduler.component';
import { EventUpdateComponent		} from './version-s/version/scheduler/event-update/event-update.component';
import { PlanDetailComponent		} from './plan-detail/plan-detail.component';
import { VersionsComponent			} from './version-s/version-s.component';
import { PlansComponent				} from './plan-s.component';
import { PlanRoutingModule			} from './plan-routing.module';
import { MaterialModule				 } from '../material.module';
import { VersionDetailComponent		  } from './version-s/version-detail/version-detail.component';
import { OrderByPipe 				   } from '../services/order-by.pipe';
import { ScheduleExportComponent		} from './version-s/version/scheduler/scheduler.component';
import { ScheduleGuestSummaryComponent	 } from './version-s/version/scheduler/scheduler-guest-summary/schedule-guest-summary.component';
import { ScheduleHostSummaryComponent	  } from './version-s/version/scheduler/scheduler-host-summary/schedule-host-summary.component';
import { ScheduleHostAllocatedComponent	   } from './version-s/version/scheduler/scheduler-host-allocated/schedule-host-allocated.component';
import { ScheduleHostUnallocatedComponent	} from './version-s/version/scheduler/scheduler-host-unallocated/schedule-host-unallocated.component';
import { SchedulerGuestAssignedComponent	 } from './version-s/version/scheduler/scheduler-guest-assigned/scheduler-guest-assigned.component';
import { SchedulerGuestAssignedCardsComponent } from './version-s/version/scheduler/scheduler-guest-assigned/scheduler-guest-assigned-cards/scheduler-guest-assigned-cards.component';
import { SchedulerGuestAssignedPeepsComponent  } from './version-s/version/scheduler/scheduler-guest-assigned/scheduler-guest-assigned-peeps/scheduler-guest-assigned-peeps.component';
import { SchedulerGuestUnassignedComponent		} from './version-s/version/scheduler/scheduler-guest-unassigned/scheduler-guest-unassigned.component';

@NgModule({
	imports:		[
		CommonModule,
		FormsModule,
		MaterialModule,
		PlanRoutingModule,
		MatDialogModule
	],
	declarations:	[
		ScheduleExportComponent,
		EventDetailComponent,
		EventListComponent,
		EventUpdateComponent,
		PlanDetailComponent,
		PlansComponent,
		SchedulerComponent,
		ScheduleGuestSummaryComponent,
		SchedulerGuestAssignedComponent,
		SchedulerGuestAssignedPeepsComponent,
		SchedulerGuestAssignedCardsComponent,
		SchedulerGuestUnassignedComponent,
		ScheduleHostAllocatedComponent,
		ScheduleHostSummaryComponent,
		ScheduleHostUnallocatedComponent,
		VersionsComponent,
		VersionDetailComponent,
		OrderByPipe
	],
	providers:		[
		{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}}
	]
})
export class PlanModule {}
