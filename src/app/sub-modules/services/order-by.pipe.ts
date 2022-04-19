
import { Pipe			} from '@angular/core';
import { PipeTransform	} from '@angular/core';
import { orderBy		} from 'lodash';

@Pipe({name: 'orderBy'})
export class OrderByPipe implements PipeTransform {
	transform ( value: any[], order = '', column: string = '' ): any[] {
		if (!value	|| order	=== '' || !order)	return value;
		if (!column	|| column	=== '')			return orderBy(value);
		if (value.length <= 1)				return value;
		return orderBy( value, [column], 'desc' )
	}
}
