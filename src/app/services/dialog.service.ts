
import { environment  } from '../../environments/environment';
import { Injectable	 } from '@angular/core';
import { Observable	} from 'rxjs';
import { of		   } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DialogService {				/* TODO: better modal implementation that doesn't use window.confirm and make it easier to test */
	env:	any;
	debug:	boolean;
	
	constructor () {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	confirm(message?: string): Observable<boolean> {
		const confirmation = window.confirm(message || 'Is it OK?');
		return of(confirmation)
	}
}
