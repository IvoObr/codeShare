import colors from 'colors';
import fs from 'fs';

export type colorT = "red" | "green" | "yellow" | "magenta";

export interface ILogLevel {
    [key: string]: ILogLevelDetails
}

export interface ILogLevelDetails {
    color: colorT,
    prefix: string;
}

/*
hard code colour
write file option in the constructor
file name
*/

class logger {

    private logFileName: string = 'jet-logger.log';
    private writeInFile: boolean = true;

    private readonly Levels: ILogLevel = {
        info: {
            color: 'green',
            prefix: 'INFO'
        },
        imp: {
            color: 'magenta',
            prefix: 'IMPORTANT'
        },
        warn: {
            color: 'yellow',
            prefix: 'WARNING'
        },
        err: {
            color: 'red',
            prefix: 'ERROR'
        }
    }

    debug(msg: string): void {
        this.printLogHelper(msg, this.Levels.info);
    }

    info(msg: string): void {
        this.printLogHelper(msg, this.Levels.info);
    }

    success(msg: string): void {
        this.printLogHelper(msg, this.Levels.imp);
    }

    warn(msg: string): void {
        this.printLogHelper(msg, this.Levels.warn);
    }

    error(msg: string): void {
        this.printLogHelper(msg, this.Levels.err);
    }

    printLogHelper(msg: string, level: ILogLevelDetails): void {
        this.printLog(msg, level);
    }

    printLog(msg: any, level: ILogLevelDetails): void {

        msg = level.prefix + ': ' + msg;
        const time: string = '[' + new Date().toISOString().replace('T', ' ').substring(0, 19) + '] ';
        msg = time + msg;
        const colorFn: colors.Color = colors[ level.color ];
        console.log(colorFn(msg));

        if (this.writeInFile) {   
            msg += '\r\n';
            this.writeToFile(msg); 
        }
    }

    writeToFile(msg: string): void {
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

    doFileExist(): boolean {
        try {
            fs.accessSync(this.logFileName);
            return true;

        } catch (error) {
            return false;
        }
    }

}

export default new logger();
  