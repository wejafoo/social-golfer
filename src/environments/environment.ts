
const firebaseConfig = {
	appId:		   '1:68199260028:web:43609f25b60561410a8ef9',
	apiKey:			'AIzaSyAm-G7sTlA_SkLeGhmY1TdAC0TczXy1Py0',
	authDomain:		 'pgc.weja.us',
	emulator:	      { auth: 'http://localhost.9099' },
	messagingSenderId: '68199260028',
	projectId:			 'weja-us',
	storageBucket: 		   'weja-us.appspot.com'
};

const alias			= 'dev';
const realmBase		= 'http://localhost';
const routeBase		= ':7777/';
const title			= 'Social Golfer';			/* const title = 'Default Private Website(' + alias + ')'; */
const isDebug		= false;
const isLocal		= true;
const isLogs		= false;
const isProd		= false;
const isRemote		= false;
const isTest		= true;
const emulateAuth	= true;						/* const emulateStorage	= false; const emulateHosting = false; */
const timeZone		= 'America/Denver';
const thisHost		= realmBase	+ routeBase;
const thisMife		= thisHost	+ '#/';
const authMife		= thisMife;
const authService	= 'login';					/* const assetsBucket = 'https://storage.googleapis.com/weja.us'; */
const defaultRosterServiceUrl = 'http://localhost:8080/tab/Presbies/query';
const defaultRosterSheetUrl =
	'https://docs.google.com/spreadsheets/d/1V8L8Ub1FRKhXo1pLxwxXiBwIz1TWtatqheHh4RPltJ8';

export const environment = {
	production: false,
	alias,
	defaults: {roster: {sheetUrl: defaultRosterSheetUrl, serviceUrl: defaultRosterServiceUrl}},
	emulate: {auth: emulateAuth},				/* storage: emulateStorage, hosting: emulateHosting */
	firebaseConfig,								/* assets: { bucket: assetsBucket }, */
	isDebug,
	isLocal,
	isLogs,
	isProd,
	isRemote,
	isTest,
	mifen: {this: thisMife, private: thisMife, auth: authMife, register: authMife + 'register'},
	service: {auth: authService},
	timeZone,
	title
};
