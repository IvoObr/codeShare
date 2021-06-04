import fs from 'fs';
import path from 'path';
import logger from './lib/logger';
import Notification from './Notification';
import { IGetTime } from './lib/interfaces';
// import {
//     exec, execSync, spawn, spawnSync,
//     ExecException, ChildProcessWithoutNullStreams
// } from 'child_process';

import util from 'util';
import child_process from 'child_process';

const exec: any = util.promisify(child_process.exec);

async function lsWithGrep(command: string) {
    try {
        const { stdout, stderr } = await exec(command);
        stdout && logger.info(stdout);
        stderr && logger.info(stderr);

    } catch (error: unknown) {
        console.error(error);
    }
}

export default class SSLRenewal {

    public async start(): Promise<void> {
        try {

            const notification: Notification = new Notification();
            // const timeoutFunc: IGetTime = this.getTimeout();
            // const timeout: number = timeoutFunc.toSeconds();
            // const date: Date = timeoutFunc.toDate();

            logger.info('process id:', process.pid.toString()?.cyan.bold);
            logger.info(`Job running in ${process.env.NODE_ENV?.cyan.bold} mode.`);
            // logger.info(`SSL renewal in ${date}.`);

            // notification.notifyForExpire(date);

            // setTimeout((): void => {
            
            const deleteFolder: string = 'rm -rf letsencrypt/';
            const cloneRepo: string = 'git clone https://github.com/letsencrypt/letsencrypt';
            const cdFolder: string = 'cd letsencrypt';
            const rmOldSSL: string = 'rm ../ssl/*';
            const issueNewSSL: string = './letsencrypt-auto certonly --config-dir ../ssl/';
            const sslDomain: string = ` --manual --email ${process.env.USER_EMAIL} -d ${process.env.DOMAIN}`;


            await lsWithGrep(rmOldSSL);
            await lsWithGrep(deleteFolder + ' && ' + cloneRepo);
            await lsWithGrep(cdFolder);
            await lsWithGrep(issueNewSSL + ' && ' + cloneRepo);
            await lsWithGrep(deleteFolder + ' && ' + sslDomain);



            /** 
                 * 
                    git clone https://github.com/letsencrypt/letsencrypt
                    cd letsencrypt
                    ./letsencrypt-auto certonly  --config-dir ../ssl/ --manual --email admin@example.com -d example.com
                    This creates a directory: /etc/letsencrypt/live/example.com/ containing certificate files:
    
                    cert.pem
                    chain.pem
                    fullchain.pem
                    privkey.pem
                 */

            // notification.notifyRenewal(date);

            // }, timeout);
        } catch (error: unknown) {
            logger.error(error);
        }
    }

    private getTimeout(): IGetTime {
        const key: Buffer = fs.readFileSync(path.resolve(__dirname, '../ssl/private-key.pem'));
        const cert: Buffer = fs.readFileSync(path.resolve(__dirname, '../ssl/public-key.pem'));

        // const cert: PeerCertificate = new TLSSocket().getPeerCertificate();

        /**
         var crt_pem = "<certificate in pem format which is content of your certificate.crt>";
            const x509 = require('x509');
            var crt_obj = x509.parseCert(crt_pem);
            console.log(crt_obj.notBefore);
            console.log(crt_obj.notAfter);
        */

        const validTo: Date = new Date();

        return {
            toDate: (): Date => new Date(validTo),
            toSeconds: (): number => Number(validTo)
        };
    }
}
