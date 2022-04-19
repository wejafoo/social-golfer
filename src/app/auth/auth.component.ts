
import { environment } from '../../environments/environment';
import { Component 		} from '@angular/core';
import { OnChanges	 		} from '@angular/core';
import { SimpleChanges			} from '@angular/core';
import { Input						} from '@angular/core';
import { Router							} from '@angular/router';
import { AngularFireAuth					} from '@angular/fire/compat/auth';
import { FirebaseUISignInFailure				} from 'firebaseui-angular';
import { FirebaseUISignInSuccessWithAuthResult		} from 'firebaseui-angular';
import { PresbyService	} from '../sub-modules/services/presby.service';

@Component({
	selector:	'app-auth',
	templateUrl: './auth.component.html',
	styleUrls:	[ './auth.component.sass'	]
})
export class AuthComponent implements OnChanges {
	e: any;
	d:   boolean;
	l:     boolean;
	idToken: string;
	@Input() isLoggedIn = false;
	
	constructor(
		public fireAuth: AngularFireAuth,
		public presby:	PresbyService,
		public router: Router
	)								 	{
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t\t>> AuthComponent');
		this.fireAuth.onIdTokenChanged(user => {
			if (user) {
				user.getIdToken().then(token => {
					this.presby.setIdToken(token);
					this.idToken = token;
		})}}).then()
	}
 	ngOnChanges(changes: SimpleChanges):		void {
		for (const isLoggedIn in changes) {
			if (changes[isLoggedIn]) {
				this.isLoggedIn		= changes[isLoggedIn].currentValue;
				const wasLoggedIn	= changes[isLoggedIn].previousValue;
				if (this.d && this.isLoggedIn) {
					console.log(
						'\t\t>> AuthComponent > user status change:',
						wasLoggedIn + ' --> ' + this.isLoggedIn
					)
				}
			}
		}
	}
	errorCallback(data: FirebaseUISignInFailure):			void {
		console.warn('\t\t>> AuthComponent > errorCallback()', data)
	}
	successCallback	(data: FirebaseUISignInSuccessWithAuthResult):	void {
		console.log('\t\t>> AuthComponent > successCallback()', data);
		this.router.navigate(['/admin']).then();
	}
}
