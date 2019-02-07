'use strict';

//Base class for PluginActions
module.exports = class PluginAction {
  constructor(options) {
    const DEFAULT_FILE_FILTER = new RegExp('(.*?)', 'gmi');
    this.priority = options.priority? options.priority : 99999;
    this.enabled = typeof options.enabled==='boolean'? options.enabled: true;
    this.fileFilter = options.fileFilter
      ? new RegExp(options.fileFilter, 'gmi')
      : DEFAULT_FILE_FILTER;
  }
}
