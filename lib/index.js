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

  return function(files, metalsmith, done) {

    //For each of the actions
    if (plugin.enabled) {
      if(plugin.hasActions()) {
        plugin.Logger('metalsmith-one-replace: start... [' + Date.now() + ']');  
        plugin.actions.forEach(action => {
          //Iterate over the files...
          action.replace(plugin, files);
        });
        plugin.Logger('metalsmith-one-replace: end [' + Date.now() + '].');  
      }
      else {
        plugin.Logger('metalsmith-one-replace: no action to perform');
      }
    } else {
      plugin.Logger('metalsmith-one-replace: disabled at config level');
    }
    done();
  };
}
module.exports = plugin;
