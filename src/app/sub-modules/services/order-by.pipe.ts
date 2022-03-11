


import { Pipe			} from '@angular/core';
import { PipeTransform	} from '@angular/core';
import { orderBy		} from 'lodash';

// import * as orderBy	from 'lodash/orderBy';    // possibly requires "allowSyntheticDefaultImports" to be set in tsconfig
// ...OR...
// e.g. import { debounce } from "lodash";

@Pipe({ name: 'orderBy' })

export class OrderByPipe implements PipeTransform {
	
	/*
		// DEFAULT TRANSFORM: transform ( value: unknown, ...args: unknown[]): unknown { return null }
		 *ngFor="let c of oneDimArray		| sortBy:'asc'"
		 *ngFor="let c of arrayOfObjects	| sortBy:'asc':'propertyName'"
	*/
	
	transform ( value: any[], order = '', column: string = '' ): any[] {
		
		if ( ! value	||  order	=== ''  ||  ! order	)	{ return value			}		// no array
		if ( ! column	||  column	=== '' ) 				{ return orderBy( value)}		// sort 1d array
		if ( value.length <= 1 ) 							{ return value			}		// array with only one item
		
		return orderBy( value, [column], 'desc' )
	}
}
