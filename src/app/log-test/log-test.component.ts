

import { Component  } from '@angular/core';
import { LogService } from '../services/log.service';

@Component({
	selector: 'app-log-test',
	templateUrl: './log-test.component.html'
})
export class LogTestComponent {

	constructor(
		private logger: LogService
	) {
	
	}
	testLog(): void {
		this.logger.log('Test the `log()` Method')
	}
}
