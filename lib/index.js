'use strict';

const Plugin = require('./class/plugin');

/**
 * Metalsmith plugin for multiple type of replace (inserting content from other file,
 * variable substitution, regex replacement) within the markdown files
 * @param {*} - config object
 * @return {function} - the metalsmith plugin
 */
function plugin(config) {
  let plugin = new Plugin(config);
  //plugin.enabled &&
  //  plugin.Logger('metalsmith-var-replace: disabled at config level');
  //plugin.hasActions() &&
  //  plugin.Logger('metalsmith-var-replace: no actions to perform');

  return function(files, metalsmith, done) {

    //For each of the actions
    if (plugin.enabled) {
      if(plugin.hasActions()) {
        plugin.Logger('metalsmith-var-replace (mvr): start... [' + Date.now() + ']');  
        plugin.actions.forEach(action => {
          //Iterate over the files...
          action.replace(plugin, files);
        });
        plugin.Logger('metalsmith-var-replace (mvr): end [' + Date.now() + '].');  
      }
      else {
        plugin.Logger('metalsmith-var-replace: no action to perform');
      }
    } else {
      plugin.Logger('metalsmith-var-replace: disabled at config level');
    }
    done();
  };
}
module.exports = plugin;
