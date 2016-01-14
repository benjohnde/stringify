var xlsx = require('xlsx')

module.exports = {
  xlsxToJson: xlsxToJson,
  stringsFromJson: stringsFromJson
}

function xlsxToJson(path) {
  var workbook = xlsx.readFile(path)
  var sheet = workbook.Sheets['Sheet1']
  return xlsx.utils
    .sheet_to_json(sheet)
    .filter(function (row) {
      return row.key
    })
}

function stringsFromJson(json, lang) {
  var strings = ['<?xml version="1.0" encoding="utf-8"?>', '<resources>']

  json.forEach(function(row) {
    var key = row.key
    var val = row[lang]

    if (val === undefined) return
    if (containsAngleBrackets(val)) {
      strings.push('\t<string name="' + key + '"><![CDATA["' + addMinimalSlashes(val) + '"]]></string>')
    } else {
      strings.push('\t<string name="' + key + '">' + addSlashes(val) + '</string>')
    }
  })
  strings.push('</resources>')
  return strings.join('\n')
}

function containsAngleBrackets(s) {
  return s.indexOf('<') > -1 || s.indexOf('>') > -1
}

function addSlashes(s) {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/\u0008/g, '\\b')
    .replace(/\t/g, '\\t')
    .replace(/\n/g, '\\n')
    .replace(/\f/g, '\\f')
    .replace(/\r/g, '\\r')
    .replace(/'/g, '\\\'')
    .replace(/"/g, '\\"')
    .replace(/&/g, '&amp;')
}

function addMinimalSlashes(s) {
  return s.replace(/'/g, '\\\'')
}
