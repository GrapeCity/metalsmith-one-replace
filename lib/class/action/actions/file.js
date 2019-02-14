const PluginAction = require("../action");
/**
 * Action will replace placeholder (default {#insert (.*)}) with file contents provided
 * the parameter.
 */
module.exports = class FilePluginAction extends PluginAction {
  constructor(options) {
    super(options);
    const DEFAULT_KEY_REGEX = new RegExp('^{#insert (.*)}', 'gmi');
    this.keyRegex = typeof options.keyRegex === 'string'
      ? new RegExp(options.keyRegex, 'gmi')
      : DEFAULT_KEY_REGEX;
    this.ignoreMissing = typeof options.ignoreMissing === 'boolean' ? options.ignoreMissing : false;
    this.removeFile = typeof options.removeFile === 'boolean' ? options.removeFile : true;
  }
  /**
   * Iterate through all files in the metalsmith build, and replace tag with actual file content
   * @param {Plugin} plugin
   * @param {*} files
   */
  replace(plugin, files) {
    plugin.Logger('m-o-r: FilePluginAction...');
    let PluginAction = this;
    var inserted_files = [];
    //For each md file...
    Object.keys(files).forEach(function(path) {
      //If the file matches the file filter...
      if (PluginAction.fileFilter.test(path)) {
        var file = files[path];
        //See if the file contains the key regex {#insert ...} or otherwise
        if (PluginAction.keyRegex.test(file.contents.toString())) {
          plugin.Logger('m-o-r (file): updating ' + path + ' file');
          var err = '';
          //Do the replacement
          file.contents = file.contents
            .toString()
            .replace(PluginAction.keyRegex, (match, path) => {
              //Get the path of provided within the insert
              if (files[path]) {
                //Make a copy of the content and return, and delete the src file if necessary
                let _copy = files[path].contents.toString();
                if(PluginAction.removeFile) inserted_files.push(path);
                //Return the string contents from the replacement path
                return _copy;
              } else {
                err = 'm-o-r (file): "' + path + '" file not found.';
                plugin.Logger(err);
                return PluginAction.ignoreMissing ? '' : err;
              }
            });
        }
        //Assign the manipulated file back into the files collection
        files[path] = file;
      }
    });
    inserted_files.forEach(file=>{
        delete files[file];
    })
    plugin.Logger('m-o-r: FilePluginAction complete.');
    return files;
  }
}
