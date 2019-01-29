'use strict';

var actionTypes = ['var', 'file', 'remove'];
var defaults = {
    fileKeyword: '^{#insert (.*)}',
    varKeyword: '{#var (.*?)}',
    filePattern: '.md$'
};

/**
 * options
 * {
 *  consoleOutput: true,
 *  actions: {
 *      {
 *          type: replace,
 *          priority: 1,
 *          keyValues: {
 *              'a':'b',
 *              'c':'d'
 *          }
 *      },
 *      {
 *      }
 *  }
 * }
 */

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
                    case 'remove':
                        var validAction = false;
                        validAction = (typeof action.filePattern === 'string') && ((typeof action.rmPatterns === 'object') && (action.rmPatterns.length > 0));
                        if (validAction){ varRemoveAction(options.consoleOutput, action, files); }
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

function varRemoveAction(logOutput, action, files){
    var regFilePattern = new RegExp(action.filePattern, 'gmi');
    var rmPatterns = [];
    action.rmPatterns.forEach(function(pattern){
        rmPatterns.push(new RegExp(pattern, 'gmi'));
    });
    var removeMatch = function(content, exp){
        return content.replace(exp, function (match, variable){ 
            return ''; }
        );
    };
    Object.keys(files).forEach(function (path) {
        if (regFilePattern.test(path)) {
            var file = files[path];
            rmPatterns.forEach(function(rm){
                if(rm.test(file.contents.toString())){
                    files[path].contents = removeMatch(file.contents.toString(), rm);
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