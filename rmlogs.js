const fs = require('fs');
const path = require('path');

/**
 * Recursively deletes files from directory matching RegEx
 * @param dir - directory
 * @param filter - filenames
 * @param excludeFolders - folders to exclude
 * @param fileList - files paths to be deleted
 */

function rmlogs(props) {
    const { dir, filter, fileList = [], ignore = /(node_modules|dist|src|.git)/ } = props;
    const files = fs.readdirSync(dir);
    
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const excluded = filePath.match(ignore);

        if (!excluded) {
            const fileStat = fs.lstatSync(filePath);

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
    dir: path.join(__dirname, './'), // start from current dir
    filter: new RegExp(/.log\b/),
    fileList: []
});