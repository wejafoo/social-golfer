

import { NgModule						} from '@angular/core';
import { CommonModule					} from '@angular/common';
import { MatButtonModule				} from '@angular/material/button';
import { MatButtonToggleModule			} from '@angular/material/button-toggle';
import { MatCardModule					} from '@angular/material/card';
import { MatCheckboxModule				} from '@angular/material/checkbox';
import { MatIconModule					} from '@angular/material/icon';
import { MatInputModule					} from '@angular/material/input';
import { MatMenuModule					} from '@angular/material/menu';
import { MatExpansionModule				} from '@angular/material/expansion';
import { MatProgressBarModule			} from '@angular/material/progress-bar';
import { MatProgressSpinnerModule		} from '@angular/material/progress-spinner';
import { MatNativeDateModule			} from '@angular/material/core';
import { MatRippleModule				} from '@angular/material/core';
import { MatSidenavModule				} from '@angular/material/sidenav';
import { MatTreeModule					} from '@angular/material/tree';
import { MatToolbarModule				} from '@angular/material/toolbar';
import { MatDatepickerModule			} from '@angular/material/datepicker';
import { DragDropModule					} from '@angular/cdk/drag-drop';
import { MatTableModule					} from '@angular/material/table';
import { OverlayModule					} from '@angular/cdk/overlay';

@NgModule({
	imports: [
		CommonModule,
		DragDropModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatExpansionModule,
		MatIconModule,
		MatInputModule,
		MatMenuModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatRippleModule,
		MatSidenavModule,
		MatTableModule,
		MatToolbarModule,
		MatTreeModule,
		OverlayModule
	],
	exports: [
		DragDropModule,
		MatNativeDateModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatExpansionModule,
		MatIconModule,
		MatInputModule,
		MatProgressSpinnerModule,
		MatMenuModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatRippleModule,
		MatSidenavModule,
		MatTableModule,
		MatToolbarModule,
		MatTreeModule,
		OverlayModule
	]
})

export class MaterialModule {}
