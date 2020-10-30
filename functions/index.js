
const fs = require('fs');
const path = require('path');
const FUNCTIONS_FOLDER = './endpoints';
fs.readdirSync(path.resolve(__dirname, FUNCTIONS_FOLDER)).forEach(file => {
    if (file.endsWith('.js')) {
        const fileBaseName = file.slice(0, -3);
        if (!process.env.FUNCTION_NAME) {
             let rfile = require(`${FUNCTIONS_FOLDER}/${fileBaseName}`);
            Object.keys(rfile).forEach(fn => {
                exports[fn] = rfile[fn]
            })
        }
    }
});