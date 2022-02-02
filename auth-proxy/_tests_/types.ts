import { IncomingMessage } from 'http';

export type IFunc = (value?: unknown) => void;

export type ICallback = (message: IncomingMessage, data: string) => void;
