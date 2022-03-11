

import { environment	} from '../../../environments/environment';
import { Injectable		} from '@angular/core';
import { HttpHeaders	} from '@angular/common/http';
import { Router			} from '@angular/router';
import { Apollo			} from 'apollo-angular';
import { gql			} from 'apollo-angular';
import { Presbies		} from '../models/roster';
import { PresbyQuery	} from '../models/roster';

const PRESBY_QUERY = gql`{ presbies {
	key id isActive last guests guestings hostings seats subs steps email home cell smail city st zip
}}`;

@Injectable({providedIn: 'root'})
export class PresbyService {
	e: any;
	d: boolean;
	l: boolean;
	
	idToken	= '';
	
	public presbies: Presbies;
	
	constructor(
		public apollo: Apollo,
		public router: Router
	)								{
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t> PresbyService');
	}
	logout()						{
		this.apollo.getClient().resetStore().then(r => {
			console.log('Shuttin\' \'er down:', r);
			this.router.navigate(['/']).then();
		});
	}
	setIdToken(newIdToken: string)	{
		this.idToken = newIdToken;
		if (this.d) console.log('\t> PresbyService > token:\t', this.idToken.substring(1, 40) + '...');
		
		this.apollo.watchQuery<PresbyQuery>({
			query: PRESBY_QUERY, context: { headers: new HttpHeaders().set(
					'Authorization', `Bearer ${this.idToken}`
		)}}).valueChanges.subscribe(p => {this.presbies = p.data.presbies})
}
}

// getPresbies() {return this.presbies}
