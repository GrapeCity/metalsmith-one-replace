'use strict';

//Base class for PluginActions
module.exports = class PluginAction {
  constructor(options) {
    const DEFAULT_FILE_FILTER = new RegExp('(.*?)', 'gmi');
    this.priority = options.priority || 1;
    this.enabled = options.enabled || true;
    this.fileFilter = options.fileFilter
      ? new RegExp(options.fileFilter, 'gmi')
      : DEFAULT_FILE_FILTER;
  }
}
