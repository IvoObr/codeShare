import * as fs from 'fs';
import * as path from 'path';

interface IProps {
    dir: string,
    filter: RegExp,
    ignore?: RegExp,
    fileList: string[]
}

/**
 * Recursively deletes files from directory matching RegEx
 * @param dir - directory
 * @param filter - filenames
 * @param excludeFolders - folders to exclude
 * @param fileList - files paths to be deleted
 */

export function rmlogs(props: IProps): string[] {

    const { dir, filter, fileList = [],
        ignore = /(node_modules|dist|src|.git)/ }: IProps = props;

    const files: string[] = fs.readdirSync(dir);

    files.forEach((file: string): void => {
        const filePath: string = path.join(dir, file);
        const excluded = filePath.match(ignore);

        if (!excluded) {
            const fileStat: fs.Stats = fs.lstatSync(filePath);

            if (fileStat.isDirectory()) {
                rmlogs({ dir: filePath, filter, ignore, fileList });

            } else if (filter.test(filePath)) {
                fileList.push(filePath);
                console.log('deleting: ', filePath);
                fs.unlink(filePath, (error) => error && console.error(error));
            }
        }
    });

    return fileList;
}

rmlogs({
    dir: path.join(__dirname, '../../../'),
    filter: new RegExp(/.log/),
    fileList: []
});