var writeDataIsON = true //use a global var so that we can write after any transformation or save the writing till the end

function loadData() {
  var wb = SpreadsheetApp.getActive()
  var sheet = wb.getSheetByName('dataFrame')
  // This represents ALL the data
  var df = sheet.getDataRange()
  var values = df.getValues()
  
  //Logger.log(temp_values.map(function(x) {return x['value']})) 
  
  //example block 1
//  var detectStr = "z"
//  var returnStr = "z was found"
//  values[5] = values[5].map(function(val, i) {if(values[2][i].indexOf(detectStr)>-1){return returnStr} else {return val}})
//  Logger.log(values[5])
//  df.setValues(values)
//  
  
  //example block 2
//  Logger.log(values[0])
//  Logger.log(namedField('A', values))
//  Logger.log(namedField('B', values))
//  Logger.log(namedField('Z', values))
//  Logger.log(values[0] == 'A')
//  var x = elwiseCompar(values[1],values[4])
//  Logger.log(x)
  //m = m.slice(1, -1)
  //Logger.log(badBoi.match(/\(.*?\)/))
  //Logger.log(badBoi.match(/\(.*\)/))
  
  //example block 2       
  //values[5] = values[2].map(callBackDetectString(detectStr)) //how to callback
  
  //var y = isArray(values)
  //var z = (values[1] === "a")
  //Logger.log(y)
  //Logger.log(z)
  //Logger.log(values[5].map(isTen))
  
  //values[5][0] = 10
  //df.setValues(values)
  return transpose(values)
}

function writeData(values){
  var wb = SpreadsheetApp.getActive()
  var sheet = wb.getSheetByName('dataFrame')
  // This represents ALL the data
  var df = sheet.getDataRange()
  return df.setValues(transpose(values))
}

function tryOut(){
  var values = loadData()
  writeData(values)
}

var callBackLance = function(detectStr, defArray) {
  //val = x['value']
  //i = x['index']
  function(x) {if(x['value'].indexOf(detectStr)>-1){return detectStr} else {return defArray[x['index']]}}
}

function isArray(x) {
    return x.constructor.toString().indexOf("Array") > -1;
}

function elwiseCompar(arrA, arrB) {
  //take in two arrays and return boolean element wise comparison
  return arrA.map(function(val, i){return val == arrB[i]});
}


function transpose(a)
{//elegant solution, we require it so that map may be applied to columns
  return Object.keys(a[0]).map(function (c) { return a.map(function (r) { return r[c]; }); });
}

function namedFieldIndex(name, arr){
  // if the first index of element is same as last then return the column of that index
  if(transpose(arr)[0].lastIndexOf(name) == transpose(arr)[0].indexOf(name)){ 
    return transpose(arr)[0].indexOf(name) 
  } else {
    return
  }
}

function squareTEST(){
  var values = loadData()
  var name = 'squareme'
  var index = namedFieldIndex(name, values)
  values[index] = values[index].map(function(x) {return x*x})
  values[index][0] = name // map function will change it so change it back
    
  //Logger.log(values[index])
  writeData(values)
  //return x
}

var callBackDetectString = function(detectStr) {  
  return function(x) {if(x.indexOf(detectStr)>-1){return detectStr} else {return}};
};

function parseConditions(cond){
  //validate structure of statement first off
  var testCond = '((ABC OR DEF) AND X AND ((Y OR Z) OR BBB)'
  
//  Logger.log(testCond.match(/\(.*\)/))
//  Logger.log(testCond.match(/\(([^\)]+)\)/))
  //Logger.log(testCond.match(/\(([^()]+)\)/g)) //<--- this bad boi right here!
  
  Logger.log(testCond)
  while (testCond.match(/\(([^()]+)\)/g)){
    testCond = testCond.replace(/\(([^()]+)\)/g, 'AINT NOTIN HERE TO SEE')
    Logger.log(testCond)
  }
  
  
//  function _tidyConditions(cond){
//  //preliminary check of conditions and any necessary refinements before parsing logic into boolean operator
//  }
}
//
//
//