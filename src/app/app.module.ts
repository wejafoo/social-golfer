

import { environment				} from '../environments/environment';
import { BrowserModule				} from '@angular/platform-browser';
import { BrowserAnimationsModule	} from '@angular/platform-browser/animations';
import { NgModule					} from '@angular/core';
import { FormsModule				} from '@angular/forms';
import { AngularFireModule			} from '@angular/fire/compat';
import { AngularFireAuthModule		} from '@angular/fire/compat/auth';

import { firebase			} from 'firebaseui-angular';
import { firebaseui			} from 'firebaseui-angular';
import { FirebaseUIModule	} from 'firebaseui-angular';

import { GraphqlModule		} from './sub-modules/graphql.module';
import { MaterialModule		} from './sub-modules/material.module';

import { AppRoutingModule	} from './app-routing.module';
import { AdminComponent		} from './admin/admin.component';
import { AppComponent		} from './app.component';
import { AuthComponent		} from './auth/auth.component';
import { MessageComponent	} from './message/message.component';
import { LogTestComponent	} from './log-test/log-test.component';
import { LogService			} from './services/log.service';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
	signInFlow: 'popup',
	signInOptions: [
		firebase.auth.GoogleAuthProvider.PROVIDER_ID,
		firebase.auth.GithubAuthProvider.PROVIDER_ID,
		{requireDisplayName: false, provider: firebase.auth.EmailAuthProvider.PROVIDER_ID},
		firebase.auth.PhoneAuthProvider.PROVIDER_ID,
		firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
	],
	credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
};

@NgModule({
	declarations: [
		AppComponent,
		AdminComponent,
		AuthComponent,
		MessageComponent,
  		LogTestComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		AppRoutingModule,
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFireAuthModule,
		FirebaseUIModule.forRoot(firebaseUiAuthConfig),
		GraphqlModule,
		MaterialModule
	],
	providers: [LogService],
	bootstrap: [AppComponent]
})
export class AppModule {}
