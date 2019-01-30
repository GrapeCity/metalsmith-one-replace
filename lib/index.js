'use strict';

var actionTypes = ['var', 'file', 'remove', 'replace'];
var defaults = {
    fileKeyword: '^{#insert (.*)}',
    varKeyword: '{#var (.*?)}',
    filePattern: '.md$'
};

/**
 * metalsmith plugin
 * @param {*} options 
 */
function varRepPlugin(options) {
    options = options || {};
    options.consoleOutput = typeof options.consoleOutput === 'boolean' ? options.consoleOutput : false;
    options.enabled = typeof options.enabled === 'boolean' ? options.enabled : false;
    if (!options.enabled) {
        if (options.consoleOutput) console.log('metalsmith-var-replace: disabled at options level');
        return;
    }
    options.actions = typeof options.actions === 'undefined' ? [] : options.actions;
    if (options.actions.length < 1) {
        if (options.consoleOutput) console.log('metalsmith-var-replace: no actions to perform');
        return;
    }
    return function (files, metalsmith, done) {
        varRepProcess(options, files, metalsmith)
        done();
    };
}

function varRepProcess(options, files, metalsmith) {
    if (options.consoleOutput) console.log('metalsmith-var-replace (mvr): start... [' + Date.now() + ']');

    options.actions.sort(actionCompare).forEach(action => {
        if (typeof action === 'object') {
            if ((typeof action.type === 'string') && (actionTypes.includes(action.type))) {
                if (options.consoleOutput) console.log('mvr: action type - ' + action.type);
                switch (action.type) {
                    case 'var':
                        action.filePattern = typeof action.filePattern === 'string' ? action.filePattern : defaults.filePattern;
                        action.ignoreMissing = typeof action.ignoreMissing === 'boolean' ? action.ignoreMissing : false;
                        action.keyword = typeof action.keyword === 'string' ? action.keyword : defaults.varKeyword;
                        varRepAction(options.consoleOutput, action, files);
                        break;
                    case 'file':
                        action.filePattern = typeof action.filePattern === 'string' ? action.filePattern : defaults.filePattern;
                        action.ignoreMissing = typeof action.ignoreMissing === 'boolean' ? action.ignoreMissing : false;
                        action.keyword = typeof action.keyword === 'string' ? action.keyword : defaults.fileKeyword;
                        action.removeFile = typeof action.removeFile === 'boolean' ? action.removeFile : true;
                        varRepAction(options.consoleOutput, action, files);
                        break;
                    case 'replace':
                        var validAction = false;
                        validAction = (typeof action.filePattern === 'string') && ((typeof action.regPatterns === 'object') && (Object.keys(action.regPatterns).length > 0));
                        if (validAction){ varRegAction(options.consoleOutput, action, files); }
                        else if (options.consoleOutput) console.log('mvr: missing/invalid remove type action settings [json: ' + JSON.stringify(action) + ']');
                        break;
                }
            }
            else if (options.consoleOutput) console.log('mvr: missing/invalid action type [json: ' + JSON.stringify(action) + ']');
        }
    });
    if (options.consoleOutput) console.log('metalsmith-var-replace (mvr): end. [' + Date.now() + ']');
}

function varRepAction(logOutput, action, files) {
    var regKeyword = new RegExp(action.keyword, 'gmi');
    var regFilePattern = new RegExp(action.filePattern, 'gmi');
    var insertedFiles = [];
    var fileReplace = function (files, file, content) {
        return content.replace(regKeyword, function (match, path) {
            if (files[path]) {
                insertedFiles.push(path);
                file.includes.push(file);
                return fileReplace(files, file, files[path].contents.toString());
            }
            var fileErr = 'mvr: "' + path + '" file not found.';
            if (logOutput) console.log(fileErr);
            return (config.ignoreMissing) ? '' : fileErr;
        });
    };
    var varReplace = function (files, file, content) {
        return content.replace(regKeyword, function (match, variable) {
            if (file[variable]) { return file[variable]; }
            else if (action.keyValues[variable]) { return action.keyValues[variable]; }
            var varErr = 'mvr: "' + variable + '" variable not found.';
            if (logOutput) console.log(varErr);
            return (action.ignoreMissing ? '' : varErr);
        });
    };
    Object.keys(files).forEach(function (path) {
        if (regFilePattern.test(path)) {
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

function varRegAction(logOutput, action, files){
    var regFilePattern = new RegExp(action.filePattern, 'gmi');
    var regPatterns = {};
    Object.keys(action.regPatterns).forEach(function(pattern){
        regPatterns[new RegExp(pattern, 'gmi')] = new RegExp(action.regPatterns[pattern], 'gmi');
    });
    Object.keys(files).forEach(function (path) {
        if (regFilePattern.test(path)) {
            var file = files[path];
            Object.keys(action.regPatterns).forEach(function(searchPattern){
                var rgSearch = new RegExp(searchPattern, 'gmi');
                if(rgSearch.test(file.contents.toString())){
                    files[path].contents = file.contents.toString().replace(rgSearch, action.regPatterns[searchPattern]);
                }
            })
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