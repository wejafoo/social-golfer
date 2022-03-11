

import { environment	} from '../../environments/environment';
import { Component		} from '@angular/core';
import { Router			} from '@angular/router';
import { FormsModule	} from '@angular/forms';

@Component({
	selector: 'app-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.sass']
})

export class MessageComponent {
	e: any;
	d: boolean;
	l: boolean;
	details = '';
	message = '';
	sending = false;
	
	constructor(private router: Router)	{
		this.e = environment;
		this.d = this.e.isDebug;
		this.l = this.e.isLogs;
	}
	send()								{
		this.sending = true;
		this.details = 'Sending Message...';
		setTimeout(() => {
			this.sending = false;
			this.closePopup()
		}, 1000 )
	}
	cancel() 							{
		this.closePopup()
	}
	closePopup()						{
		this.router.navigate([{outlets: {popup: null}}]).then()
	}
}
