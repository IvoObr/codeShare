import colors from 'colors';
import fs from 'fs';
import util from 'util';

export type colorT = "red" | "green" | "yellow" | "strip" | "dim" | "white";

export interface ILogLevel {
    color: colorT,
    prefix: string;
}

export interface ILogOptions {
    logFileName: string,
    writeInFile: boolean
}

class logger {

    private logFileName: string = 'logger.log';
    private writeInFile: boolean = true;

    constructor(options?: ILogOptions) {

        if (typeof options?.logFileName === 'string') {
            this.logFileName = options?.logFileName;
        }

        if (typeof options?.writeInFile === 'boolean') {
            this.writeInFile = options?.writeInFile;
        }
    }

    public inspect(msg: string): void {
        msg = util.inspect(msg);
        this.printLog(msg, {
            color: 'dim',
            prefix: 'INSPECT: '
        });
    }

    public info(msg: string): void {
        this.printLog(msg, {
            color: 'white',
            prefix: 'INFO:    '
        });
    }

    public success(msg: string): void {
        this.printLog(msg, {
            color: 'green',
            prefix: 'SUCCESS: '
        });
    }

    public warn(msg: string): void {
        this.printLog(msg, {
            color: 'yellow',
            prefix: 'WARNING: '
        });
    }

    public error(msg: Error | string): void {
        // msg = util.inspect(msg);
        this.printLog(msg, {
            color: 'red',
            prefix: 'ERROR:   '
        });
    }

    private printLog(msg: string | Error, level: ILogLevel): void {

        const time: string = '[' + new Date().toISOString().replace('T', ' ').substring(0, 19) + ']';
        const colorFn: colors.Color = colors[level.color];
        console.log(`${time} ${colorFn(level.prefix).bold} ${colorFn(msg as string)}`);
         
        if (this.writeInFile) {   
            this.writeToFile(`${time} ${level.prefix}: ${msg += '\r\n'}`); 
        }
    }

    private writeToFile(msg: string): void {
        try {
            const fileExists: boolean = this.doFileExist();

            if (fileExists) {
                fs.appendFileSync(this.logFileName, msg);

            } else {
                fs.writeFileSync(this.logFileName, msg);
            }

        } catch (error) {
            console.error(error);
        }
    }

    private doFileExist(): boolean {
        try {
            fs.accessSync(this.logFileName);
            return true;

        } catch (error) {
            return false;
        }
    }

}

export default new logger();
  