import { AxiosError } from 'axios';
import logger from '../src/lib/logger';

export function handleError(error: AxiosError): void {

    logger.error(error?.response?.data?.error || error);
    expect(typeof error).not.toBeDefined();
}