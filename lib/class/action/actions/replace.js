const PluginAction = require("../action");

/**
 * Action will replace defined placeholder with RegEx pattern
 * Ex. '{#img (.*?)}':'<img $1>',
 */
module.exports = class ReplacePluginAction extends PluginAction {
  constructor(options) {
    super(options);
    this.replacePatterns = options.replacePatterns
      ? options.replacePatterns
      : {};
  }
  replace(plugin, files) {
    console.log('doing ReplacePluginAction replacement');
    let PluginAction = this;
    Object.keys(files).forEach(function(path) {
      if (PluginAction.fileFilter.test(path)) {
        var file = files[path];
        Object.keys(PluginAction.replacePatterns).forEach(function(
          searchPattern
        ) {
          var rgSearch = new RegExp(searchPattern, 'gmi');
          if (rgSearch.test(file.contents.toString())) {
            files[path].contents = file.contents
              .toString()
              .replace(rgSearch, PluginAction.replacePatterns[searchPattern]);
            plugin.Logger('mvr: ' + path + ' file updated');
          }
        });
        files[path] = file;
      }
    });
    return files;
  }
}
