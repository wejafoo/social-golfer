

import { NgModule				} from '@angular/core';
import { RouterModule			} from '@angular/router';
import { Routes					} from '@angular/router';
import { canActivate			} from '@angular/fire/compat/auth-guard';
import { redirectUnauthorizedTo	} from '@angular/fire/compat/auth-guard';
import { AdminComponent			} from './admin/admin.component';
import { MessageComponent		} from './message/message.component';
import { LogTestComponent		} from './log-test/log-test.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/']);

const routes: Routes = [
	{ path: 'plan',		...canActivate(redirectUnauthorizedToLogin),	loadChildren: () => import('./sub-modules/plan-s/plan.module'	).then(m => m.PlanModule	)},
	{ path: 'hosts',	...canActivate(redirectUnauthorizedToLogin),	loadChildren: () => import('./sub-modules/plan-s/plan.module'	).then(m => m.PlanModule	)},
	{ path: 'guests',	...canActivate(redirectUnauthorizedToLogin),	loadChildren: () => import('./sub-modules/plan-s/plan.module'	).then(m => m.PlanModule	)},
	{ path: 'page',														loadChildren: () => import('./second-page/second.module'		).then(m => m.SecondModule	)},
	{ path: 'log',		component: LogTestComponent},
	{ path: 'admin',	component: AdminComponent,	...canActivate(redirectUnauthorizedToLogin)},
	{ path: 'message',	component: MessageComponent, outlet: 'popup'},
	{ path: '',			redirectTo: '/', pathMatch: 'full'}
];

@NgModule({imports: [RouterModule.forRoot(routes, {enableTracing: false})], exports: [RouterModule]})
export class AppRoutingModule {}
