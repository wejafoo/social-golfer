
import { environment } from '../../environments/environment';
import { Component } from '@angular/core';
import { Router	  } from '@angular/router';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.sass']
})
export class AdminComponent {
	e:	any;
	d:		boolean;
	changed:	boolean;
	panelOpenState:	boolean;
	initRosterSheetUrl:	string;
	initRosterServiceUrl:	string;
	roster = {sheetUrl:	'', serviceUrl:	''};

	constructor(
		private router: Router
	)				{
		this.e = environment;
		this.d = this.e.isDebug;
		this.changed = false;
		if ( window.localStorage.getItem('roster') !== null ) {
			this.roster = JSON.parse( window.localStorage.getItem('roster') || '{}');
			if (this.d) console.log('\t\t>> AdminComponent > Imported valid roster config');
		}
		this.initRosterSheetUrl		= this.e.defaults.roster.sheetUrl;
		this.initRosterServiceUrl	= this.e.defaults.roster.serviceUrl;
		this.panelOpenState			= true;
	}
	save(): void	{
		this.roster.sheetUrl	= this.initRosterSheetUrl;
		this.roster.serviceUrl	= this.initRosterServiceUrl;
		window.localStorage.setItem('roster', JSON.stringify(this.roster));
		this.router.navigate(['/plan', 's']).then();
	}
	back(): void	{
		this.initRosterSheetUrl		= this.roster.sheetUrl;
		this.initRosterServiceUrl	= this.roster.serviceUrl;
		this.changed				= false;
		this.router.navigate(['/plan', 's']).then()
	}
	updateRosterSheetUrl(newValue: string): void	{
		this.changed			= true;
		this.initRosterSheetUrl	= newValue;
	}
	updateRosterServiceUrl(newValue: string): void	{
		this.changed				= true;
		this.initRosterServiceUrl	= newValue;
	}
}
