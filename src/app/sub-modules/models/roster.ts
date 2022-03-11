

export type Guests		= Guest[];
export type Hosts		= Host[];
export type PresbyQuery	= {presbies: Presbies}
export type Presbies	= Presby[];

export interface Host {
	event:			string;
	seats?:			number;
	hostKey?:		string;
	id?:			number;
	guests?:		string[];
	hostName?:		string;
	isAssignable?:	boolean;
	isAssigned?:	boolean;
	isDisabled?:	boolean;
}
export interface Guest {
	event:			string;
	guestKey?:		string;
	id?:			number;
	guests?:		string[];
	partyName?:		string;
	cnt?:			number;
	isAssignable?:	boolean;
	isAssigned?:	boolean;
	isDisabled?:	boolean;
}
export type Presby = {
	key:		string;
	id:			number;
	isActive:	boolean;
	last:		string;
	guests:		string[];
	guestings:	Guests;
	hostings:	Hosts;
	seats?:		number;
	subs?:		boolean;
	steps?:		boolean;
	email?:		string;
	home?:		string;
	cell?:		string;
	smail?:		string;
	city?:		string;
	st?:		string;
	zip?:		string;
}
