
import { environment 		} from '../environments/environment';
import { Component			} from '@angular/core';
import { AngularFireAuth	} from '@angular/fire/compat/auth';
import { Title				} from '@angular/platform-browser';
import { Router				} from '@angular/router';
import { RouterOutlet		} from '@angular/router';
import { map				} from 'rxjs/operators';
import { title				} from '../main';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass'],
})
export class AppComponent  {
	e: any;
	d:  boolean;
	l:   boolean;
	auth: any;
	title: string;
	isLoggedIn = false;
	
	constructor(
		public fireAuth:	AngularFireAuth,
		public router:		Router,
		public titleService: Title
	)					{
		this.e		= environment;
		this.d		= this.e.isDebug;
		this.l		= this.e.isLogs;
		this.title	= title;
		this.setTitle(this.title);
		if (this.d) console.log('AppComponent > e:', this.e);
		this.fireAuth.authState.pipe(
			map(u => !!u)
		).subscribe(
			isLoggedIn => this.isLoggedIn = isLoggedIn
		)
	}
	logout():				void {
		this.fireAuth.signOut().then();
		this.router.navigate(['/']).then();
	}
	setTitle(newTitle: string):		void {
		this.titleService.setTitle(newTitle)
	}
	getAnimationData(outlet: RouterOutlet):	void {
		return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation']
	}
}
