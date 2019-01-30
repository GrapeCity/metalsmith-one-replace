# metalsmith-var-replace

A Metalsmith/markdown plugin for multiple type of replace (inserting content from other file, variable substitution, regex replacement) within the markdown files.

## Installation

## Config

```js
{
    consoleLog: false,
    enabled: true,
    actions: [{
        priority: 10,
        type:'file'
        },{
        priority: 20,
        type:'var',
        keyValues:{
            'f1':'Apple',
            'f2':'Orange',
            'f3':'Banana'
        },{
        priority: 1,
        type:'replace',
        filePattern:'.svg$',
        regPatterns:{
            '^\s*$':'',
            '<(([a-z]+)*[^>]+)\/>':'<$1></$2>',
            '([a-z:-A-Z0-9]+)="null"?([ ]+)?':''
        },{
        enabled: false,
        priority:5,
        type:'replace',
        filePattern:'.md$',
        regPatterns:{
            '{#img (.*?)}':'<img $1>',
            '{#bold (.*?)}':'<b>$1</b>'
        }
    ]
}
```

Defaults values of some of the config attributes are:

* `consoleLog` (boolean) defaults to `false`
* `enabled` (boolean) defaults to `true`
* `actions` (array of objects) is mandatory
  * `priority` (number) is optional

## CLI Usage

## Javascript Usage

## License

MIT
