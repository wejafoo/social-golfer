

import { environment	} from '../../../../../../../environments/environment';
import { Component		} from '@angular/core';
import { Input			} from '@angular/core';
import { OnChanges 		} from '@angular/core';
import { OnInit			} from '@angular/core';
import { SimpleChanges	} from '@angular/core';
import { IPlan			} from '../../../../../models/plan';
import { IVersion		} from '../../../../../models/plan';

@Component({
	selector: 'app-event-plan-list-host-detail',
	templateUrl: './event-detail.component.html',
	styleUrls: ['./event-detail.component.sass']
})

export class EventDetailComponent implements OnInit, OnChanges {
	e: any;
	d: boolean;
	l: boolean;
	eventIndex:	number;
	@Input() eventId:	number;
	@Input() planId:	number;
	@Input() plan:	IPlan;
	@Input() ver:	IVersion;

	constructor()	{
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
		if (this.d) console.log('\t> EventDetailComponent');
	}
	ngOnInit()		{
		this.eventIndex = this.ver.events.findIndex(event => event.id === this.eventId)
	}
	ngOnChanges(changes: SimpleChanges)	{
		this.eventIndex = this.ver.events.findIndex(event => event.id === this.eventId)
	}
}
