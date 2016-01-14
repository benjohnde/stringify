#!/usr/bin/env node
var program = require('commander')
var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var utils = require('./utils')

program
  .version('0.0.1')
  .description('Picks xlsx file and generates string-files for droid.')
  .arguments('<languages...>')
  .action(function(a) {
    languages = a
  })
  .option('-c, --cheese [cheese]', 'Specify input xlsx defaulting to "./in.xlsx"', './in.xlsx')
  .option('-p, --path [path]', 'Specify output path defaulting to "./res"', './res')
  .parse(process.argv)

if (!program.args.length) {
  program.help()
  return
}

function xlsxToStrings(input, output) {
  var strings = utils.xlsxToJson(input)
  languages.forEach(function(lang) {
    var xml = utils.stringsFromJson(strings, lang)
    var folder = '/values'
    if (lang !== 'en') folder += '-' + lang
    var outputAbsolute = path.join(output, folder)
    mkdirp(outputAbsolute, function(err) {
      if (err) throw err
      var file = path.join(outputAbsolute, 'strings.xml')
      fs.writeFile(file, xml, 'utf8', function(err) {
        if (err) throw err
        console.log(file + " written.")
      })
    })
  })
}

xlsxToStrings(program.cheese, program.path)
