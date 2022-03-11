

import { environment	} from '../../environments/environment';
import { Injectable		} from '@angular/core';
import { Observable		} from 'rxjs';
import { of				} from 'rxjs';

// Async modal dialog service -- mock this service for easier testing
// TODO: better modal implementation that doesn't use window.confirm and make it easier to test

@Injectable({ providedIn: 'root' })

export class DialogService {
	env:	any;
	debug:	boolean;
	
	constructor () {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	
	confirm( message?: string ): Observable<boolean> {
		const confirmation = window.confirm( message  ||  'Is it OK?' );
		return of( confirmation )																						// Return confirmation observable resolving to `true`=confirm or `false`=cancel
	}
}
