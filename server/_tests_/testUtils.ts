import colors from 'colors';
import { AxiosError, AxiosResponse } from 'axios';
colors.enable();

export function handleError(path: string, error: AxiosError): void {
    const response: AxiosResponse | undefined = error?.response;
    const status: string = response?.status?.toString().cyan || 'NOT_HERE';

    console.log(path, status, response?.data?.error || error);
    expect(typeof error).not.toBeDefined();
}