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
  !plugin.enabled &&
    plugin.Logger('metalsmith-var-replace: disabled at config level');
  !plugin.hasActions() &&
    console.log('metalsmith-var-replace: no actions to perform');

  return function(files, metalsmith, done) {
    plugin.Logger(
      'metalsmith-var-replace (mvr): start... [' + Date.now() + ']'
    );

    //For each of the actions
    if (plugin.enabled) {
      plugin.actions.forEach(action => {
        //Iterate over the files...
        action.replace(plugin, files);
      });
    } else {
      plugin.Logger('All actions are disabled');
    }

    plugin.Logger('metalsmith-var-replace (mvr): end. [' + Date.now() + ']');
    done();
  };
}
module.exports = plugin;
