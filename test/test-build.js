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
        priority: 10,
        type: 'file'
      },{
        priority: 20,
        type: 'var',
        keyValues: {
          'f1':'Apple',
          'f2':'Orange',
          'f3':'Banana',
          'f4':'Grapes'
        }
      },{
        priority: 1,
        type: 'remove',
        filePattern: '.svg$',
        rmPatterns: [
          '\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>',
          '(xml([a-z:-A-Z0-9]+))=[\"]?((?:.(?![\"]?\s+(?:\S+)=|[>\"]))+.)[\"]?',
          '^\s*$(?:\r\n?|\n)',
          '([a-z:-A-Z0-9]+)="null"?'
        ]
      }
    ]
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
