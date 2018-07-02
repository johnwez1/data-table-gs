function evaluateExpression(cond, arr) {
    /*
    The main function for parsing the conditions.
    Algorithm works as follows:
    For each character in the expression:
        If the character is an operator (one of '(', ')', '+', '-' ), 
            then push it to the operator stack
            otherwise push the character to the expression stack
            
            If also, the expression stack and operator stack contains
                then evaluate pop the composites, calculate and push the result back on to the expression stack
        
    The expression stack thus keeps composite expressions together and works through the entire expression from left to right until complete.
    */
    cond = '(' + cond + ')'
    
    var newCond = cond.replace(/ AND /, '*').replace(/ OR /, '+')
    while(newCond != cond){
      newCond = newCond.replace(/ AND /, '*').replace(/ OR /, '+')
      cond = cond.replace(/ AND /, '*').replace(/ OR /, '+')
    }
    
    cond = cond.split('')
    Logger.log(cond)
    //also take out double whitespace
    var el
    var index
    //pad with ( + expr + )
    expressionStack = ['']
    operatorStack = []
    for(c in cond){
        index = parseInt(c)
        el = cond[index]
        
        if(['(', ')', '*', '+'].indexOf(el) > -1){
            
            operatorStack.push(el)
            var prevOperator = operatorStack[operatorStack.length - 2]
            var prevExpression = expressionStack[expressionStack.length - 2]  
            var curExpression = expressionStack[expressionStack.length - 1]
            
            
            Logger.log(operatorStack)
            Logger.log(expressionStack)
            Logger.log(el)
            Logger.log(prevOperator)
            
            if(el == ')' && prevOperator == '('){
               //()
               expressionStack[expressionStack.length - 1] = 
                 evaluateBasicExpression(curExpression, arr)
               operatorStack.pop()
               operatorStack.pop()
               continue
            }
            
            if(el == '*' || el == '+' || el == ')'){
                if(prevOperator == '+' || prevOperator == '*'){
                    //++ or +)
                    
                    //statement finished, evaluate base and push up level
                    expressionStack[expressionStack.length - 1] = 
                        evaluateBasicExpression(curExpression, arr)
                    
                    //combine base with row above
                    expressionStack[expressionStack.length - 2] = 
                    compoundBooleanArr(expressionStack[expressionStack.length - 1],
                                       prevExpression,
                                       prevOperator)
                    
                    //two into one
                    expressionStack.pop()
                    //used three
                    if (el == ')'){
                        operatorStack.pop()
                        operatorStack.pop()
                        operatorStack.pop()
                    }
                    if (el == '*' || el == '+'){
                        operatorStack.pop()
                        operatorStack.pop()
                        operatorStack.push(el)
                    }
                }
              
                if (prevOperator == '(' || prevOperator == null){
                    //statement finished, evaluate
                    expressionStack[expressionStack.length - 1] = 
                        evaluateBasicExpression(curExpression, arr)
                }
            }
            
            if(['(', '*', '+', ')'].indexOf(cond[index+1]) == -1){
              //only push if you know next thing is not a symbol and it's not the last char, dont push first in this variation
              if(index != 0 && index < cond.length - 1){
                expressionStack.push('')
              } else {
//                Logger.log("last element up next, no push")
//                Logger.log(cond[index+1])
              }
            }
            
        } else {
            //partial push to string only
            expressionStack[expressionStack.length - 1] = expressionStack[expressionStack.length - 1] +  el
        }  
    }
    //confirm the structure we have here
    return expressionStack[0] 
}

function isBasicExpression(statement) {
    if(statement.indexOf(" AND ") == -1 && statement.indexOf(" OR ") == -1){
        return false
    } else {
        return true
    }
}

function evaluateBasicExpression(statement, arr) {
  if(isArray(statement)){
    //check if it has already been evaluated
    return(statement)
  }
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
  //trim whitespace
  statement = statement.trim()   
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

function checkConditions(cond){
  //check if any remaining parenthesis anywhere
  if (cond.match(/\(/g).length != cond.match(/\)/g).length){
    return false
  }
  
  //reduce pairings of parenthesis
  while (cond.match(/\(([^()]+)\)/g)){
    //check innermost
    var innermost = cond.match(/\(([^()]+)\)/g);
    for (match in innermost){
      if(!(parseBoolStatement(innermost[match]))){
        return false
      }
    }
    
    cond = cond.replace(/\(([^()]+)\)/g, 'valid is valid')    
    Logger.log('list of conditions becomes:')
    Logger.log(cond)
  }
  
  //check if any remaining parenthesis anywhere
  
  if ((cond.match(/\(/g) || cond.match(/\)/g))){
    return false
  }
  return true
}

function parseSplit(expression){
  //expression must be parseable as JSON!!!
  //var expression = '{"field":"FIELDNAME", "by":"SPLITAROUND", "index":INT (KEEP THIS INDEX)}' //if 
  var expressionJSON = JSON.parse(expression)
  if(expressionJSON.field == null || expressionJSON.by == null || expressionJSON.index == null){return} 
  return expressionJSON
}

function isArray(x) {
    return x.constructor.toString().indexOf("Array") > -1;
}