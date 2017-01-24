const fs = require("fs");

class Utils
{
    static buildFileList(directory, extension, fileList) {
        const files = fs.readdirSync(directory);
        for(const i in files) {
            if (!files.hasOwnProperty(i)) {
                continue;
            }
            let name = `${directory}/${files[i]}`;
            if(fs.statSync(name).isDirectory()) {
                continue;
            }
            let regExp = new RegExp(extension);
            if(!name.match(regExp)) {
                continue;
            }
            fileList.push(name);
        }
    }

    static findFiles(directory, extension) {
        const fileList = [];
        Utils.buildFileList(directory, extension, fileList);
        return fileList;
    }
}

module.exports = Utils;