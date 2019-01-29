var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');
var vreplace = require('..');

metalsmith(__dirname)
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
