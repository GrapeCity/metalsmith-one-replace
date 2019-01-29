var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');
var vreplace = require('..');

metalsmith(__dirname)
    .use(vreplace({
      consoleOutput: true,
      enabled: true,
      actions: [{
        priority: 1,
        type: 'file',
        keyword: '^{#insert (.*)}',
        filePattern: '.md$',
        removeFile: true
      }]
    }))
    .use(markdown())
    .use(permalinks())
    .clean(true)
    .use(templates({
      engine: 'handlebars'
    }))
    .source('./src')
    .destination('./build')
    .build(function (err) { 
        if(err) console.log(err)
    })
