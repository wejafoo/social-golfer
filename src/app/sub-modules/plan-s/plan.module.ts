

import { NgModule								} from '@angular/core';
import { CommonModule							} from '@angular/common';
import { FormsModule							} from '@angular/forms';
import { MatDialogModule						} from '@angular/material/dialog';
import { EventDetailComponent					} from './version-s/version/event/event-detail/event-detail.component';
import { EventListComponent						} from './version-s/version/event/event-list/event-list.component';
import { ScheduleComponent						} from './version-s/version/schedule/schedule.component';
import { EventUpdateComponent					} from './version-s/version/schedule/event-update/event-update.component';
import { PlanDetailComponent					} from './plan-detail/plan-detail.component';
import { VersionsComponent						} from './version-s/version-s.component';
import { PlansComponent							} from './plan-s.component';
import { PlanRoutingModule						} from './plan-routing.module';
import { MaterialModule							} from '../material.module';
import { VersionDetailComponent					} from './version-s/version-detail/version-detail.component';
import { OrderByPipe 							} from '../services/order-by.pipe';
import { ScheduleExportComponent				} from './version-s/version/schedule/schedule.component';
import { ScheduleGuestSummaryComponent			} from './version-s/version/schedule/schedule-guest-summary/schedule-guest-summary.component';
import { ScheduleHostSummaryComponent			} from './version-s/version/schedule/schedule-host-summary/schedule-host-summary.component';
import { ScheduleHostAllocatedComponent			} from './version-s/version/schedule/schedule-host-allocated/schedule-host-allocated.component';
import { ScheduleHostUnallocatedComponent		} from './version-s/version/schedule/schedule-host-unallocated/schedule-host-unallocated.component';
import { ScheduleGuestAssignedComponent			} from './version-s/version/schedule/schedule-guest-assigned/schedule-guest-assigned.component';
import { ScheduleGuestAssignedCardsComponent	} from './version-s/version/schedule/schedule-guest-assigned/schedule-guest-assigned-cards/schedule-guest-assigned-cards.component';
import { ScheduleGuestAssignedPeepsComponent	} from './version-s/version/schedule/schedule-guest-assigned/schedule-guest-assigned-peeps/schedule-guest-assigned-peeps.component';
import { ScheduleGuestUnassignedComponent		} from './version-s/version/schedule/schedule-guest-unassigned/schedule-guest-unassigned.component';

// import { VersionListComponent } from './version-s/version/version-list/version-list.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MaterialModule,
		PlanRoutingModule,
		MatDialogModule
	],
	declarations: [
		ScheduleExportComponent,
		EventDetailComponent,
		EventListComponent,
		EventUpdateComponent,
		PlanDetailComponent,
		PlansComponent,
		ScheduleComponent,
		ScheduleGuestSummaryComponent,
		ScheduleGuestAssignedComponent,
		ScheduleGuestAssignedPeepsComponent,
		ScheduleGuestAssignedCardsComponent,
		ScheduleGuestUnassignedComponent,
		ScheduleHostAllocatedComponent,
		ScheduleHostSummaryComponent,
		ScheduleHostUnallocatedComponent,
		VersionsComponent,
		VersionDetailComponent,
		OrderByPipe
	]
})

export class PlanModule {}
