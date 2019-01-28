'use strict';


/**
 * options
 * {
 *  consoleOutput: true,
 *  actions: {
 *      action: {
 *          type: replace,
 *          priority: 1,
 *          keyValues: {
 *              'a':'b',
 *              'c':'d'
 *          }
 *      },
 *      action: {
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
    if(options.consoleOutput) console.log('metalsmith-var-replace: start... [' + Date.now() + ']');
    


    if(options.consoleOutput) console.log('metalsmith-var-replace: end. [' + Date.now() + ']');
}

function test()
{
    console.log('test - start');
    varrep({
        consoleOutput: true,
        enabled: false
    });
    console.log('test - end');
}

module.exports = varrep;

test();