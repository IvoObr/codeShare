import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursively deletes files from directory matching RegEx
 * @param dir - directory
 * @param filter - filenames
 * @param excludeFolders - folders to exclude
 * @param fileList - files paths to be deleted
 */

export function rmlogs(dir: string, filter: RegExp, excludeFolders?: RegExp, fileList: string[] = []) {
    const files: string[] = fs.readdirSync(dir);
    excludeFolders = excludeFolders || /(node_modules|dist|src|.git)/;

    files.forEach((file: string) => {
        const filePath: any = path.join(dir, file);
        const excluded = filePath.match(excludeFolders);

        if (!excluded) {
            const fileStat = fs.lstatSync(filePath);

            if (fileStat.isDirectory()) {
                rmlogs(filePath, filter, excludeFolders, fileList);

            } else if (filter.test(filePath)) {
                fileList.push(filePath);
                console.log('deleting: ', filePath);
                fs.unlink(filePath, (error) => error && console.error(error));
            }
        }
    });

    return fileList;
}

rmlogs(path.join(__dirname, '../../../'), /.log/);