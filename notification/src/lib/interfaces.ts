export interface IMessage {
    from?: string;
    to?: string;
    subject?: string;
    body?: string;
    replyTo?: string;
    headers?: { [key: string]: string }
}

export interface ICerts {
    key: Buffer;
    cert: Buffer;
    ca: Buffer;
}

export interface IMailInfo {
    accepted: string[];
    rejected: string[];
    envelopeTime: number;
    messageTime: number;
    messageSize: number;
    response: string;
    envelope: { [key: string]: string };
    messageId: string;
}