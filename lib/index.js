'use strict';

var actionTypes = ['var', 'file'];

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
function varrep(options) {

    /** 
    if(typeof options != 'object'){
        throw new Error('metalsmith-var-replace expect object option');
    }
    */
    
    options = options || {};
    options.consoleOutput = typeof options.consoleOutput === 'boolean' ? options.consoleOutput : false;
    options.enabled = typeof options.enabled === 'boolean' ? options.enabled : false;
    if(!options.enabled) {
        if(options.consoleOutput) console.log('metalsmith-var-replace: disabled at options level');
        return;
    }
    options.actions = typeof options.actions === 'undefined' ? [] : options.actions;
    if(options.actions.length < 1) {
        if(options.consoleOutput) console.log('metalsmith-var-replace: no actions to perform');
        return;
    }
    if(options.consoleOutput) console.log('metalsmith-var-replace (mvr): start... [' + Date.now() + ']');

    options.actions.sort(actionCompare).forEach(action => {
        if(typeof action === 'object') {
            if ((typeof action.type === 'string') && (actionTypes.includes(action.type))){
                switch(action.type){
                    case 'var':
                    console.log('var ' + action);
                    break;
                    case 'file':
                    console.log('file' + action);
                    fileInsert(action);
                    break;
                }
            }
            else if (options.consoleOutput) console.log('mvr: missing/invalid action type [json: ' + JSON.stringify(action) + ']');
        }
    });
    
    if(options.consoleOutput) console.log('metalsmith-var-replace (mvr): end. [' + Date.now() + ']');
}

function fileInsert(action) {
    console.log('inside');
    var regKeyword = new RegExp(typeof action.keyword === 'string' ? action.keyword : '^{#insert (.*)}', 'gmi');
    var regFilePattern = new RegExp(typeof action.filePattern === 'string' ? action.filePattern : '.md$', 'gmi');
    action.ignoreMissing = typeof action.ignoreMissing === 'boolean' ? action.ignoreMissing : false;
    var fileReplace = function (files, file, content) {
        return content.replace(regKeyword, function (match, path) {
            if (files[path]) {
                file.includes.push(file);
                return fileReplace(files, file, files[path].contents.toString());
            }
            return (config.ignoreMissing) ? '' : 'mvr: "' + path + '" file not found.';
        });
    };
    return function(files, metalsmith, done){
        console.log('return');
        files.forEach(file, path => {
            console.log(file);
            if(regFilePattern.test(path)){
                if(regKeyword.test(file.contents.toString())){
                    file.includes = [];
                    files[path].contents = fileReplace(files, file, file.contents.toString());
                }
                console.log(path);
            }
        });
        done();
    };
}

function actionCompare(a,b){
    if (a.priority < b.priority)
    return -1;
  if (a.priority > b.priority)
    return 1;
  return 0;
}

module.exports = varrep;