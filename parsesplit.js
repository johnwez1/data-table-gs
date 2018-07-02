function parseSplit(expression){
  //expression must be parseable as JSON!!!
  //var expression = '{"field":"FIELDNAME", "by":"SPLITAROUND", "index":INT (KEEP THIS INDEX)}' //if 
  var expressionJSON = JSON.parse(expression)
  if(expressionJSON.field == null || expressionJSON.by == null || expressionJSON.index == null){return} 
  return expressionJSON
}