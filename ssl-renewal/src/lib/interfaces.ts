export interface IGetTime{
    toSeconds(): number;
    toDate(): Date;
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
    error?: string;
}
