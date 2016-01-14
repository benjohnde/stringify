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
      strings.push('\t<string name="' + key + '"><![CDATA["' + formatText(val) + '"]]></string>')
    } else {
      strings.push('\t<string name="' + key + '">' + formatText(val) + '</string>')
    }
  })
  strings.push('</resources>')
  return strings.join('\n')
}

function containsAngleBrackets(s) {
  return s.indexOf('<') > -1 || s.indexOf('>') > -1
}

function formatText(s) {
  return s.replace(/&/g, '&amp;')
}
