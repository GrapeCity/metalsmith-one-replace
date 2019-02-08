'use strict';

//Base class for PluginActions
module.exports = class PluginAction {
  constructor(options) {
    const DEFAULT_FILE_FILTER = new RegExp('(.*?)', 'i');
    this.priority = typeof options.priority === 'number' ? options.priority : 99999;
    this.enabled = typeof options.enabled === 'boolean' ? options.enabled : true;
    this.fileFilter = typeof options.fileFilter === 'string'
      ? new RegExp(options.fileFilter, 'i')
      : DEFAULT_FILE_FILTER;
  }
}