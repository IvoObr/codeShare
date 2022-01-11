const fs = require('fs');
const path = require('path');
const readline = require('readline')
    .createInterface({
        input: process.stdin,
        output: process.stdout
    });

(function() {
    /**
     * Recursively finds files from directory matching RegEx
     * @param dir - directory
     * @param filter - filenames
     * @param excludeFolders - folders to exclude
     * @param fileList - file paths to be deleted
     */
    function findFilesR(props) {

        const { dir, filter, fileList = [],
            ignore = /(node_modules|dist|src|.git|.vscode)/ } = props;
    
        const files = fs.readdirSync(dir);
    
        files.forEach((file) => {
            const filePath = path.join(dir, file);
            const excluded = filePath.match(ignore);
            if (excluded) return;

            const fileStat = fs.lstatSync(filePath);

            if (fileStat.isDirectory()) {
                findFilesR({ dir: filePath, filter, ignore, fileList });

            } else if (filter.test(filePath)) {
                fileList.push(filePath);
            }        
        });

        return fileList;
    }

    function deleteFiles(fileList) {
        let ask = `\u001B[33m\u001B[1mAre you sure that you want to delete these files? (yes/no)\u001B[0m\n`;
        fileList.forEach(filePath => ask += filePath + '\n');

        readline.question(ask + '\n', answer => {
            console.log();

            if (answer !== 'yes') {
                console.log('\u001B[32m\u001B[1mAborting\u001B[0m');
                readline.close();
                return;
            }

            fileList.forEach(function(filePath) {
                fs.unlink(filePath, function(error) {
                    if (error) console.error(error);
                    else console.log('\u001B[31m\u001B[1mDeleted:\u001B[0m ', filePath);    
                });     
            });

            readline.close();
        });
    }

    const fileList = findFilesR({
        dir: path.join(__dirname, './'), // start from current dir
        filter: new RegExp(/.log\b/),
        fileList: []
    });

    if (fileList.length === 0) {
        console.log('\u001B[32m\u001B[1mNo logs found. Bye!\u001B[0m');
        readline.close();
        return;
    }

    deleteFiles(fileList);
})();
