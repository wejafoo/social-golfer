

import { Injectable } from '@angular/core';

export enum LogLevel {All = 0, Debug = 1, Info = 2, Warn = 3, Error = 4, Fatal = 5, Off = 6}

@Injectable({providedIn: 'root'})
export class LogService {
	level: LogLevel	= LogLevel.All;
	logWithDate		= true;
	
	debug (msg: string, ...optionalParams: any[]) { this.writeToLog(msg, LogLevel.Debug, optionalParams)}
	info  (msg: string, ...optionalParams: any[]) { this.writeToLog(msg, LogLevel.Info,  optionalParams)}
	warn  (msg: string, ...optionalParams: any[]) { this.writeToLog(msg, LogLevel.Warn,  optionalParams)}
	error (msg: string, ...optionalParams: any[]) { this.writeToLog(msg, LogLevel.Error, optionalParams)}
	fatal (msg: string, ...optionalParams: any[]) { this.writeToLog(msg, LogLevel.Fatal, optionalParams)}
	log   (msg: string, ...optionalParams: any[]) { this.writeToLog(msg, LogLevel.All,   optionalParams)}
	
/*
	static formatParams(params: any[]):			string {
		let ret: string = params.join(',');
		if (params.some(p => typeof p === 'object')) {
			ret = '';
			for (const item of params) { ret += JSON.stringify(item) + ',' }
		}
		return ret
	}
*/
	private shouldLog(level: LogLevel):					boolean {
		let ret = false;
		if ((level >= this.level && level !== LogLevel.Off) || this.level === LogLevel.All) { ret = true }
		
		return ret
	}
	private writeToLog(msg: string, level: LogLevel, params: any[]) {
		if (this.shouldLog(level)) {
			let value = '';
			if (this.logWithDate) { value = new Date() + ' - '}        	/* Build log string */
			value += 'Type: ' + LogLevel[this.level];
			value += ' - Message: ' + msg;
			if (params.length) { value += ' - Extra Info: '} 			/* + this.formatParams(params) */
			console.log(value)                                         	/* Log the value */
		}
	}
}

export class LogEntry {
	/* entryDate: Date = new Date(); */
	level:		LogLevel = LogLevel.Debug;
	extraInfo:	any[]	  = [];
	logWithDate			   = true;
	message					= '';
	
	buildLogString(): string {
		let ret = '';
		if (this.logWithDate) { ret = new Date() + ' - '}
		
		ret += 'Type: ' + LogLevel[this.level];
		ret += ' - Message: ' + this.message;
		if (this.extraInfo.length) { ret += ' - Extra Info: '} /* this.formatParams(this.extraInfo)} */
		
		return ret
	}
/*
	private formatParams(params: any[]): string {
		let ret: string = params.join(',');
		if (params.some(p => typeof p === 'object')) {
			ret = '';
			for (const item of params) { ret += JSON.stringify(item) + ','}
		}
		return ret
	}
*/
}
