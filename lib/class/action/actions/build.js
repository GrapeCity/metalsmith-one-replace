const PluginAction = require("../action");

/**
 * Action will replace defined placeholder with a complex string
 * Ex. '{#banner (.*?)}'
 */
module.exports = class BuildPluginAction extends PluginAction {
    constructor(options) {
        super(options);
        const DEFAULT_TAG_REGEX = new RegExp('^{#banner (.*)}', 'gmi');
        this.tag = typeof options.tag === 'string'
            ? new RegExp(options.tag, 'gmi')
            : DEFAULT_TAG_REGEX;
        this.body = typeof options.body === 'string'
            ? options.body
            : '';
    }
    /**
     * Iterate through all files in the metalsmith build, and do tag replacement based on the replaceBody
     * @param {Plugin} plugin
     * @param {*} files
     */
    replace(plugin, files){
        plugin.Logger('m-o-b: BuildPluginAction...');
        let PluginAction = this;
        Object.keys(files).forEach(function (path){
            if(PluginAction.fileFilter.test(path)){
                var file = files[path];
                if(PluginAction.tag.test(file.contents.toString())){
                    plugin.Logger('m-o-b (file): updating ' + path + ' file');
                    file.contents = file.contents
                    .toString()
                    .replace(PluginAction.tag, (match, js) => {
                        let _json = JSON.parse(js);
                        let _result = '';
                        for(i in _json){
                            let _str = this.body;
                            for (j in _json[i]){
                                _str = _str.replace('{{'+j+'}}', _json[i][j]);
                            }
                            if(_str != this.body){
                                _result += _str;
                            }
                        }
                        return _result;
                    });
                }
                files[path] = file;
            }
        });
        plugin.Logger('m-o-b: BuildPluginAction complete.')
        return files;
    }
}