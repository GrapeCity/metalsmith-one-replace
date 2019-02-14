const PluginAction = require("../action");

/**
 * Action will replace defined placeholder with RegEx pattern
 * Ex. '{#img (.*?)}':'<img $1>',
 */
module.exports = class ReplacePluginAction extends PluginAction {
  constructor(options) {
    super(options);
    this.replacePatterns = typeof options.replacePatterns === 'object'
      ? options.replacePatterns
      : {};
  }
    /**
   * Iterate through all files in the metalsmith build, and do regex/tag replacement
   * @param {Plugin} plugin
   * @param {*} files
   */
  replace(plugin, files) {
    plugin.Logger('m-o-r: ReplacePluginAction...');
    let PluginAction = this;
    Object.keys(files).forEach(function (path) {
      if (PluginAction.fileFilter.test(path)) {
        var file = files[path];
        var isReplace = false;
        Object.keys(PluginAction.replacePatterns).forEach(function (searchPattern) {
          var rgSearch = new RegExp(searchPattern, 'gmi');
          if (rgSearch.test(file.contents.toString())) {
            files[path].contents = file.contents
              .toString()
              .replace(rgSearch, PluginAction.replacePatterns[searchPattern]);
            isReplace = true;
          }
        });
        files[path] = file;
        if (isReplace) plugin.Logger('m-o-r (replace): ' + path + ' file updated');
      }
    });
    plugin.Logger('m-o-r: ReplacePluginAction complete.');
    return files;
  }
}
