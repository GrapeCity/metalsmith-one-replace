'use strict';

var actionTypes = ['var', 'file', 'replace'];
var defaults = {
    fileKeyRegex: '^{#insert (.*)}',
    varKeyRegex: '{#var (.*?)}',
    fileFilter: '(.*?)'
};

/**
 * Metalsmith plugin for multiple type of replace (inserting content from other file,
 * variable substitution, regex replacement) within the markdown files
 * @param {*} - config object
 * @return {function} - the metalsmith plugin
 */
function varRepPlugin(config) {
    if (typeof config != 'object') { throw new Error('metalsmith-var-replace: config is required.'); }
    config.consoleLog = typeof config.consoleLog === 'boolean' ? config.consoleLog : false;
    config.enabled = typeof config.enabled === 'boolean' ? config.enabled : false;
    if (!config.enabled) {
        if (config.consoleLog) console.log('metalsmith-var-replace: disabled at config level');
        return;
    }
    config.actions = typeof config.actions === 'undefined' ? [] : config.actions;
    if (config.actions.length < 1) {
        if (config.consoleLog) console.log('metalsmith-var-replace: no actions to perform');
        return;
    }
    return function (files, metalsmith, done) {
        varRepProcess(config, files, metalsmith)
        done();
    };
}

function varRepProcess(config, files, metalsmith) {
    if (config.consoleLog) console.log('metalsmith-var-replace (mvr): start... [' + Date.now() + ']');

    config.actions.sort(actionCompare).forEach(action => {
        if (typeof action === 'object') {
            if ((typeof action.type === 'string') && (actionTypes.includes(action.type))) {
                if (config.consoleLog) console.log('mvr: action type - ' + action.type);
                action.enabled = typeof action.enabled === 'boolean' ? action.enabled : true;
                action.fileFilter = typeof action.fileFilter === 'string' ? action.fileFilter : defaults.filePattern;
                if (action.enabled) {
                    switch (action.type) {
                        case 'var':
                            action.ignoreMissing = typeof action.ignoreMissing === 'boolean' ? action.ignoreMissing : false;
                            action.keyRegex = typeof action.keyRegex === 'string' ? action.keyRegex : defaults.varKeyRegex;
                            varRepAction(config.consoleLog, action, files);
                            break;
                        case 'file':
                            action.ignoreMissing = typeof action.ignoreMissing === 'boolean' ? action.ignoreMissing : false;
                            action.keyRegex = typeof action.keyRegex === 'string' ? action.keyRegex : defaults.fileKeyRegex;
                            action.removeFile = typeof action.removeFile === 'boolean' ? action.removeFile : true;
                            varRepAction(config.consoleLog, action, files);
                            break;
                        case 'replace':
                            var validAction = false;
                            validAction = (typeof action.fileFilter === 'string') && ((typeof action.replacePatterns === 'object') && (Object.keys(action.replacePatterns).length > 0));
                            if (validAction) { varRegAction(config.consoleLog, action, files); }
                            else if (config.consoleLog) console.log('mvr: missing/invalid remove type action settings [json: ' + JSON.stringify(action) + ']');
                            break;
                    }
                }
                else if (config.consoleLog) console.log('mvr: action (type: ' + action.type + ' priority: ' + action.priority + ') is disabled');
            }
            else if (config.consoleLog) console.log('mvr: missing/invalid action type [json: ' + JSON.stringify(action) + ']');
        }
    });
    if (config.consoleLog) console.log('metalsmith-var-replace (mvr): end. [' + Date.now() + ']');
}

function varRepAction(logOutput, action, files) {
    var regKeyword = new RegExp(action.keyRegex, 'gmi');
    var regFileFilter = new RegExp(action.fileFilter, 'gmi');
    var insertedFiles = [];
    var err = '';
    var fileReplace = function (files, file, content) {
        return content.replace(regKeyword, function (match, path) {
            if (files[path]) {
                insertedFiles.push(path);
                file.includes.push(file);
                return fileReplace(files, file, files[path].contents.toString());
            }
            err = 'mvr: "' + path + '" file not found.';
            if (logOutput) console.log(err);
            return (config.ignoreMissing) ? '' : err;
        });
    };
    var varReplace = function (files, file, content) {
        return content.replace(regKeyword, function (match, variable) {
            if (file[variable]) { return file[variable]; }
            else if (action.varValues[variable]) { return action.varValues[variable]; }
            err = 'mvr: "' + variable + '" variable not found.';
            if (logOutput) console.log(err);
            return (action.ignoreMissing ? '' : err);
        });
    };
    Object.keys(files).forEach(function (path) {
        if (regFileFilter.test(path)) {
            var file = files[path];
            if (regKeyword.test(file.contents.toString())) {
                if (logOutput) console.log('mvr: updating ' + path + ' file');
                file.includes = [];
                if (action.type === 'file')
                    files[path].contents = fileReplace(files, file, file.contents.toString());
                else if (action.type === 'var')
                    files[path].contents = varReplace(files, file, file.contents.toString());
            }
        }
    });
    if ((action.type === 'file') && (action.removeFile)) {
        if (logOutput) console.log('mvr: removing files [post insert]');
        insertedFiles.forEach(function (path) {
            delete files[path];
        });
    }
}

function varRegAction(logOutput, action, files) {
    var regFileFilter = new RegExp(action.fileFilter, 'gmi');
    var regPatterns = {};
    var isUpdate = false;
    Object.keys(action.replacePatterns).forEach(function (pattern) {
        regPatterns[new RegExp(pattern, 'gmi')] = new RegExp(action.replacePatterns[pattern], 'gmi');
    });
    Object.keys(files).forEach(function (path) {
        if (regFileFilter.test(path)) {
            isUpdate = false;
            var file = files[path];
            Object.keys(action.replacePatterns).forEach(function (searchPattern) {
                var rgSearch = new RegExp(searchPattern, 'gmi');
                if (rgSearch.test(file.contents.toString())) {
                    files[path].contents = file.contents.toString().replace(rgSearch, action.replacePatterns[searchPattern]);
                    isUpdate = true;
                }
            })
            if ((isUpdate) && (logOutput)) console.log('mvr: ' + path + ' file updated');
        }
    });
}

function actionCompare(a, b) {
    if (a.priority < b.priority)
        return -1;
    if (a.priority > b.priority)
        return 1;
    return 0;
}

module.exports = varRepPlugin;