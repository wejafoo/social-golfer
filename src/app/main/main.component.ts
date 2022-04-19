
import { Component	} from '@angular/core';
import { OnInit		} from '@angular/core';
import { Router			} from '@angular/router';
import { AngularFireAuth		} from '@angular/fire/compat/auth';
import { FirebaseUISignInFailure		} from 'firebaseui-angular';
import { FirebaseUISignInSuccessWithAuthResult	} from 'firebaseui-angular';

@Component({
	selector:	'app-main',
	templateUrl: './main.component.html',
	styleUrls: [  './main.component.scss'	]
})
export class MainComponent implements OnInit {
	constructor(private afAuth: AngularFireAuth, private router: Router) {}
	ngOnInit():				void {
		this.afAuth.authState.subscribe(d => console.log(d));
	}
	logout		():						void  {
		this.afAuth.signOut();
	}
	uiShownCallback	():								void  {
		console.log('UI shown');
	}
	errorCallback		(data: FirebaseUISignInFailure): 		void  {
		console.warn('errorCallback', data);
	}
	successCallback			(data: FirebaseUISignInSuccessWithAuthResult): void  {
		console.log('successCallback', data);
		this.router.navigate(['page']);
	}
}
