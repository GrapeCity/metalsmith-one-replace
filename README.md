# metalsmith-var-replace

A Metalsmith/markdown plugin for multiple type of replace (inserting content from other file, variable substitution, regex replacement) within the markdown files.

## Config

Example
```js
...
{
    consoleLog: false,
    enabled: true,
    actions: [{
        priority: 10,
        type:'file'
    },{
        priority: 20,
        type:'var',
        varValues:{
            'f1':'Apple',
            'f2':'Orange',
            'f3':'Banana'
        }
    },{
        priority: 1,
        type:'replace',
        fileFilter:'.svg$',
        replacePatterns:{
            '\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>':'',
            '(xml([a-z:-A-Z0-9]+))=[\"]?((?:.(?![\"]?\s+(?:\S+)=|[>\"]))+.)[\"]?([ ]+)?':'',
            '^\s*$':'',
            '<(([a-z]+)*[^>]+)\/>':'<$1></$2>',
            '([a-z:-A-Z0-9]+)="null"?([ ]+)?':''
        }
    },{
        enabled: false,
        priority:5,
        type:'replace',
        fileFilter:'.md$',
        replacePatterns:{
            '{#img (.*?)}':'<img $1>',
            '{#bold (.*?)}':'<b>$1</b>'
        }
    }]
}
...
```

More information about config attributes:

* `consoleLog` (optional boolean default:`false`) - to log the info to console
* `enabled` (optional boolean default:`true`) - to enable/disable the entire plugin
* `actions` (array of action objects) is mandatory
  * `priority` (optional number) - to specify the sequence order while processing
  * `enabled` (optional boolean default:`true`) - to enable/disable a specific action
  * `fileFilter` (optional regex string default:`(.*?)`) - to filter files for processing under a specific action
  * `type` (string values are `var`, `file`, and `replace`) is mandatory - to specify the routine while processing
    * attributes when `type` is `var`
      * `keyRegex` (optional regex string default:`{#var (.*?)}`) - regex to find the tag (example `{#var}`) with the variable name as the parameter
      * `varValues` (key-value pair object) is mandatory - with variable name and it's value as key-value pair
      * `ignoreMissing` (optional boolean default:`false`) - ignore (by substituting it with blank) if the variable is not defined
    * attributes when `type` is `file`
      * `keyRegex` (optional regex string default:`^{#insert (.*)}`) - regex to find the tag (example `{#insert}`) with the name of the file (with path) as parameter
      * `ignoreMissing` (optional boolean default:`false`) - ignore (by substituting it with blank) if the file is not found
      * `removeFile` (optional boolean default:`true`) - remove the file from target folder after inserting the content
    * attributes when `type` is `replace`
      * `replacePatterns` (key-value pair object) is mandatory - regex find and replace string as key-value pair

## Documentation

Refer to the [wiki](https://github.com/GrapeCity/metalsmith-var-replace/wiki)

## License

MIT
