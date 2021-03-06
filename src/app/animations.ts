
import { trigger		} from '@angular/animations';
import { animateChild	} from '@angular/animations';
import { group			} from '@angular/animations';
import { transition		} from '@angular/animations';
import { animate		} from '@angular/animations';
import { style			} from '@angular/animations';
import { query			} from '@angular/animations';

export const slideInAnimation = trigger(
	'routerOutlet',
	[	transition( 'presbies <=> presby', [
		style({position: 'relative'}),
		query(':enter, :leave', [style({position:	'absolute', top: 0, left: 0, width:	'100%'})]),
		query(':enter', [style({left: '-100%'})]),
		query(':leave', animateChild()), group( [
			query(':leave', [animate('300ms ease-out', style({left: '100%'}))]),
			query(':enter', [animate('300ms ease-out', style({left: '0%'}))])
		]),
		query( ':enter', animateChild())
	])]
)
