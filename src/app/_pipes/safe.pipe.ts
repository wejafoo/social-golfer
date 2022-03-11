

import { environment		} from '../../environments/environment';
import { Pipe				} from '@angular/core';
import { PipeTransform		} from '@angular/core';
import { DomSanitizer		} from '@angular/platform-browser';
import { SafeHtml			} from '@angular/platform-browser';
import { SafeStyle			} from '@angular/platform-browser';
import { SafeScript			} from '@angular/platform-browser';
import { SafeUrl			} from '@angular/platform-browser';
import { SafeResourceUrl	} from '@angular/platform-browser';

@Pipe({ name: 'safe' })

export class SafePipe implements PipeTransform {
	env: any;
	
	constructor( protected sanitizer: DomSanitizer ) { this.env = environment; }
	
	public transform( value: any, type: string ): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
		switch ( type ) {
			case 'html':		return this.sanitizer.bypassSecurityTrustHtml(value);
			case 'style':		return this.sanitizer.bypassSecurityTrustStyle(value);
			case 'script':		return this.sanitizer.bypassSecurityTrustScript(value);
			case 'url':			return this.sanitizer.bypassSecurityTrustUrl(value);
			case 'resourceUrl':	return this.sanitizer.bypassSecurityTrustResourceUrl(value);
			default:			throw new Error(`Invalid safe type specified: ${type}`);
		}
	}
}
