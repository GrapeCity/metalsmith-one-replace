const PluginAction = require("../action");

/**
 * Action will replace placeholder within the file (default denoted with {#var ...})
 * with variable. Variable can be define within YAML of the same file with the Markdown,
 * or within a varValues provided as a parameter to this action.
 */
module.exports = class VarPluginAction extends PluginAction {
  constructor(options) {
    super(options);
    const DEFAULT_KEY_REGEX = new RegExp('{#var (.*?)}', 'gmi');
    this.keyRegex = typeof options.keyRegex === 'string'
      ? new RegExp(options.keyRegex, 'gmi')
      : DEFAULT_KEY_REGEX;
    this.ignoreMissing = typeof options.ignoreMissing === 'boolean' ? options.ignoreMissing : false;
    this.varValues = options.varValues ? options.varValues : {};
  }
  /**
   * Iterate through all files in the metalsmith build, and do variable replacement
   * @param {Plugin} plugin
   * @param {*} files
   */
  replace(plugin, files) {
    plugin.Logger('m-o-r: VarPluginAction...');
    let PluginAction = this;
    //For each md file...
    Object.keys(files).forEach(function(path) {
      //If the file matches the file filter...
      if (PluginAction.fileFilter.test(path)) {
        var file = files[path];
        //See if the file contains the key regex {#var ...} or otherwise
        if (PluginAction.keyRegex.test(file.contents.toString())) {
          plugin.Logger('m-o-r (var): updating ' + path + ' file');
          var err = '';
          //Do the replacement
          file.contents = file.contents
            .toString()
            .replace(PluginAction.keyRegex, (match, param) => {
              if (file[param]) {
                return file[param];
              } else if (PluginAction.varValues[param]) {
                return PluginAction.varValues[param];
              }
              err = 'm-o-r (var): "' + param + '" variable not found.';
              plugin.Logger(err);
              return PluginAction.ignoreMissing ? '' : err;
            });
        }
        //Assign the manipulated file back into the files collection
        files[path] = file;
      }
    });
    plugin.Logger('m-o-r: VarPluginAction complete.');
    return files;
  }
}
