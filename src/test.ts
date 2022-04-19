
import { getTestBed				 } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { platformBrowserDynamicTesting	} from '@angular/platform-browser-dynamic/testing';
import 'zone.js/testing';

declare const require: any;
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(), {teardown: { destroyAfterEach: false}}
);
const context = require.context('./', true, /\.spec\.ts$/);
context.keys().map(context);
