export interface IMessage {
    from?: string;
    to?: string;
    subject?: string;
    body?: string;
    replyTo?: string;
    headers?: { [key: string]: string }
}