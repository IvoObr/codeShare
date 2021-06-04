import fs from 'fs';
import path from 'path';
import SocketClient from './SocketClient'
import tls, { TLSSocket, PeerCertificate} from 'tls';

export default class SSLRenewal {

    public start(): void {

        const timeout: number = this.getTimeout();

        setTimeout((): void => {
            /**
                git clone https://github.com/letsencrypt/letsencrypt
                cd letsencrypt
                ./letsencrypt-auto certonly --manual --email admin@example.com -d example.com
                This creates a directory: /etc/letsencrypt/live/example.com/ containing certificate files:

                cert.pem
                chain.pem
                fullchain.pem
                privkey.pem
             */

        }, timeout);
    }

    private notifyForExpire(): void {
        try {
            const timeout: number = this.getTimeout();

            const message: string = JSON.stringify({
                to: process.env.USER_EMAIL,
                subject: 'CodeShare SSL Expiry',
                body: `<p>Dear Dev,</p>
                       <p>The SSL certificates for the codeChare project will expire in ${timeout}.</p>
                       <p>There will be automatic SSL renewal attempt. Nonetheless check the certificates.
                       <p>All the Best!</p>
                       <p>And Happy Coding <🍺>< /p>`
            });

            new SocketClient()
                .notificationSocket()
                .send(message)
                .onSuccess((info: unknown): void => {
       
                })
                .onError((error: string): void => {
        
                });
        } catch (error: unknown) {

        }
    }

    private getTimeout(): number {
        const key: Buffer = fs.readFileSync(path.resolve(__dirname, '../ssl/private-key.pem'));
        const cert: Buffer = fs.readFileSync(path.resolve(__dirname, '../ssl/public-key.pem'));


        const cert: PeerCertificate = new TLSSocket().getPeerCertificate();


        /**
         var crt_pem = "<certificate in pem format which is content of your certificate.crt>";
            const x509 = require('x509');
            var crt_obj = x509.parseCert(crt_pem);
            console.log(crt_obj.notBefore);
            console.log(crt_obj.notAfter);
        */

        const validTo: Date = tls...


    }
}
