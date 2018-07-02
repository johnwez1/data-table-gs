function loadData() {
  var wb = SpreadsheetApp.getActive()
  var sheet = wb.getSheetByName('dataFrame')
  // This represents ALL the data
  var df = sheet.getDataRange()
  var values = df.getValues()

  return transpose(values)
}

function writeData(values){
  var wb = SpreadsheetApp.getActive()
  var sheet = wb.getSheetByName('dataFrame')
  // This represents ALL the data
  var df = sheet.getDataRange()
  return df.setValues(transpose(values))
}

function isArray(x) {
    return x.constructor.toString().indexOf("Array") > -1;
}

function elwiseCompar(arrA, arrB) {
  return arrA.map(function(val, i){return val == arrB[i]});
}

function namedFieldIndex(name, arr){
  // if the first index of element is same as last then return the column of that index
  if(transpose(arr)[0].lastIndexOf(name) == transpose(arr)[0].indexOf(name)){ 
    return transpose(arr)[0].indexOf(name) 
  } else {
    return
  }
}

function transpose(a)
{
  return Object.keys(a[0]).map(function (c) { return a.map(function (r) { return r[c]; }); });
}

function compoundBooleanArr(arr1, arr2, operator){    
    //need to use map because && || operators dont work on arrays as expected, 
    // eg x = [true, false, false], y = [true, true, false]
    // but (y || x) != (x || y) 
    if(operator == '*'){
      return arr1.map(function(val, i) {return (val && arr2[i])})
    }
    if(operator == '+'){
      return arr1.map(function(val, i) {return (val || arr2[i])})
    }   
}
