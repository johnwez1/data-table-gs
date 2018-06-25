function testArray() {
    var x = ['arr1', '1', '2', '3'];
    var y = ['arr2', 'A', 'B', 'C'];
    var z = ['arr3', 'x', 'y', 'z'];
    var data = ['data', 'DATA', 'DATA', 'DATA']
    
    return [x, y, z, data]
}


function evaluateExpression(cond, arr) {
    var testCond = 'arr1 is 2 AND (arr2 is not A OR arr3 contains z)'
    //also take out double whitespace
    if(isBasicExpression(testCond)){
        
    }
    var condsplit = testCond.split(" AND ")

    return condsplit
}

function isBasicExpression(statement) {
    if(statement.indexOf(" AND ") == -1 && statement.indexOf(" OR ") == -1){
        return false
    } else {
        return true
    }
}

function evaluateBasicExpression(statement, arr) {
    var parsedStatement = parseBasicExpression(statement)
    var lh_index = namedFieldIndex(parsedStatement["lh"], arr)
    switch (parsedStatement["comparator"]) {
        case ' is not ':
            return arr[lh_index].map(function(val) {return val != parsedStatement["rh"]});
            break;
        case ' is ':
            return arr[lh_index].map(function(val) {return val == parsedStatement["rh"]});
            break;
        case ' contains ':
            return arr[lh_index].map(function(val) {return (val.indexOf(parsedStatement["rh"]) > -1)});
            break;
        case ' contains not ':
            return arr[lh_index].map(function(val) {return (val.indexOf(parsedStatement["rh"]) == -1)});
            break;
        case ' after ':
            return arr[lh_index].map(function(val) {return (val > parsedStatement["rh"])});
            break;
        case ' before ':
            return arr[lh_index].map(function(val) {return (val < parsedStatement["rh"])});
            break;
    }
}

function parseBasicExpression(statement){
  //parseables have the 'not' option first so that we can simply detect 
  var parseables = [' is not ', ' is ', ' contains not ', ' contains ', ' after ', ' before '];
  var comparator
  
  for (comparator in parseables){
    comparator = parseables[comparator]
    if(statement.indexOf(comparator) > -1){
      comparator = comparator
      break
    }  
  }
  
  //if we get to the end and no match found, then return NULL
  if (!(parseables.indexOf(comparator) > -1)){return 'comparator not in parseables'}
  if ((comparator == ' after ' || comparator == ' before ') && statement.split(comparator)[0] != 'date'){
    return
  }
  return {lh: statement.split(comparator)[0], comparator: comparator, rh: statement.split(comparator)[1]}
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
{//elegant solution, we require it so that map may be applied to columns
  return Object.keys(a[0]).map(function (c) { return a.map(function (r) { return r[c]; }); });
}