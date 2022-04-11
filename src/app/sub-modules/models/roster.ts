

export type Guests = Guest[];
export type Hosts    = Host[];
export type Presbies   = Presby[];
export type PresbyQuery  = {presbies: Presbies}

export interface Host {
	event: string;
	id?:    number;
	seats?:  number;
	guests?:  string[];
	hostKey?:  string;
	assigned?:  Guests;
	hostName?:   string;
	isAssigned?:  boolean;
	isDisabled?:   boolean;
	isAssignable?:  boolean;
}

export interface Guest {
	event: string;
	id?:    number;
	cnt?:    number;
	guests?:  string[];
	guestKey?: string;
	partyName?: string;
	isAssigned?: boolean;
	isDisabled?:  boolean;
	isAssignable?: boolean;
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
