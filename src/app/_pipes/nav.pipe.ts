

import {	Pipe,
			PipeTransform	} from '@angular/core';

@Pipe({ name: 'nav' })


export class NavPipe implements PipeTransform {
	transform( value: any, args?: any ): any { return null; }
}
