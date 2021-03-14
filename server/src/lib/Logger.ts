// import Logger from 'jet-logger';
// import colors from 'colors';

// class logger extends Logger {

//     success(msg: string): void {
//         Logger.Info(msg.yellow);
//     }

//     info(msg: string): void {
//         Logger.Info(msg);
//     }

//     warn(msg: string): void {
//         Logger.Warn(msg);
//     }

//     debug(msg: string): void {
//         Logger.Imp(msg.grey);
//     }

//     error(msg: string | Error): void {
//         Logger.Err(msg, true);
//     }
// }

// export default new logger();


import colors from 'colors';
import fs from 'fs';

const Levels: any = {
    info: {
        color: 'green',
        prefix: 'INFO',
    },
    imp: {
        color: 'magenta',
        prefix: 'IMPORTANT',
    },
    warn: {
        color: 'yellow',
        prefix: 'WARNING',
    },
    err: {
        color: 'red',
        prefix: 'ERROR',
    }
};

class logger {

    Info (content:any) {
        this.PrintLogHelper(content, Levels.info);
    }
    Imp (content:any) {
        this.PrintLogHelper(content, Levels.imp);
    }
    Warn(content:any) {
        this.PrintLogHelper(content, Levels.warn);
    }

    Err (content:any) {
        this.PrintLogHelper(content, Levels.err);
    }

    PrintLogHelper (content:any, level:any) {
        this.PrintLog(content, level);
    }

    info (content: any) {
        this.printLogHelper(content, Levels.info);
    }

    imp (content:any) {
        this.printLogHelper(content, Levels.imp);
    }

    warn (content:any) {
        this.printLogHelper(content, Levels.warn);
    }

    err (content:any) {
        this.printLogHelper(content, Levels.err);
    }

    printLogHelper (content:any, level:any) {
        this.PrintLog(content, level,);
    }

    PrintLog (content:any, level:any) {
     
        content = level.prefix + ': ' + content; // todo CONTENT LINE
        const time: string = '[' + new Date().toISOString() + '] ';
        content = time + content;
        const colorFn: any = colors[ level.color ];
        console.log(colorFn(content));
 
    }
    WriteToFile (content: any, filePath: any) {
        try {
            const fileExists = this.CheckExists(filePath);
            if (fileExists) {
                fs.appendFileSync(filePath, content);
            }
            else {
                fs.writeFileSync(filePath, content);
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    CheckExists (filePath: any) {
        try {
            fs.accessSync(filePath);
            return true;
        }
        catch (e) {
            return false;
        }
    }

    DEFAULT_LOG_FILE_NAME = 'jet-logger.log';
}
export default new logger();

  