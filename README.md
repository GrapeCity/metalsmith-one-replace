# metalsmith-var-replace

A Metalsmith/markdown plugin for multiple type of replace (inserting content from other file, variable substitution, regex replacement) within the markdown files.

## Installation

## Config

```json
{
    consoleOutput: false,
    enabled: true,
    actions: [{
        priority: 2,
        type:'file'
        },{
        priority: 3,
        type:'var',
        keyValues:{
            'f1':'Apple',
            'f2':'Orange',
            'f3':'Banana'
        },{
        priority: 1,
        type:'replace',
        filePattern:'.md$',
        regPatterns:{
            '^\s*$':''
        }
    ]
}
```

## CLI Usage

## Javascript Usage

## License

MIT
