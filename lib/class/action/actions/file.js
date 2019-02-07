const PluginAction = require("../action");
/**
 * Action will replace placeholder (default {#insert (.*)}) with file contents provided
 * the parameter.
 */
module.exports = class FilePluginAction extends PluginAction {
  constructor(options) {
    super(options);
    const DEFAULT_KEY_REGEX = new RegExp('^{#insert (.*)}', 'gmi');
    this.keyRegex = options.keyRegex
      ? new RegExp(options.keyRegex, 'gmi')
      : new RegExp(DEFAULT_KEY_REGEX, 'gmi');
    this.ignoreMissing = options.ignoreMissing ? options.ignoreMissing : false;
    this.removeFile = options.removeFile ? options.removeFile : true;
  }

  replace(plugin, files) {
    console.log('doing FilePluginAction replacement');
    let PluginAction = this;
    //For each md file...
    Object.keys(files).forEach(function(path) {
      //If the file matches the file filter...
      if (PluginAction.fileFilter.test(path)) {
        var file = files[path];
        //See if the file contains the key regex {#insert ...} or otherwise
        if (PluginAction.keyRegex.test(file.contents.toString())) {
          plugin.Logger('mvr: updating ' + path + ' file');
          var err = '';
          //Do the replacement
          file.contents = file.contents
            .toString()
            .replace(PluginAction.keyRegex, (match, path) => {
              //Get the path of provided within the insert
              if (files[path]) {
                //Make a copy of the content and return, and delete the src file if necessary
                let _copy = files[path].contents.toString();
                if (PluginAction.removeFile){
                    delete files[path];
                } 
                //Return the string contents from the replacement path
                return _copy;

              } else {
                if (!PluginAction.ignoreMissing) {
                  plugin.Logger('mvr: "' + path + '" file not found.');
                }
                //return nothing
                return;
              }
            });
        }
        //Assign the manipulated file back into the files collection
        files[path] = file;
      }
    });
    return files;
  }
}
