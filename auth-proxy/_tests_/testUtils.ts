import colors from 'colors';
import { StatusCodes } from '../src/lib/enums';
// import { AxiosError, AxiosResponse } from 'axios';
// colors.enable();

// error: AxiosError
export function handleError(path: string, error: any, statusCode?: StatusCodes): void {
    
    // const response: AxiosResponse | undefined = error?.response;
    // const status: string = response?.status?.toString()?.cyan || 'NOT_HERE';

    // if (statusCode === StatusCodes.UNAUTHORIZED) {
    //     expect(response?.status).toBe(statusCode);
    //     return;
    // }

    // console.log(path, status, response?.data?.error || error);
    // expect(typeof error).not.toBeDefined();
}