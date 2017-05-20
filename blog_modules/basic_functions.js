//***Regular Expressions***

module.exports.usernameRegex = function(regexObj){
  if(regexObj.length < 4){//put <4, but I wanna test
    return("Nume de utilizator prea scurt!");
  }
  else if(regexObj.length > 22){
    return("Nume de utilizator prea lung!");
  }
  else if(regexObj.search(/[^a-zA-Z0-9\_\.]/) != -1){
    return("In numele de utilizator puteti folosi litere, cifre si urmatoarele simboluri:\"., _\". ");
  }
  return("ok");
}


module.exports.passwordRegex = function(password){
  if(password.length < 6){//put <6, but I wanna test
    return("Parola este prea scurta!");
  }
  else if(password.length > 50){
    return("Parola este prea lunga!");
  }
  else if(password.search(/[^a-zA-Z0-9\!\@\#\$\*\_\+\.]/) != -1){
    return("In parola puteti folosi litere, numere si urmatoarele simboluri:\"!, @, #, $, *, ., +, _\". ");
  }
  return("ok");
}


module.exports.removeLetters = function(myString){

return myString.replace(/\D/g,'');


}


module.exports.safeUser = function(result){

    if(result){

      var safeResult = result.map(function(a){
        return { username: a.username, posts: a.posts }
      });
      return safeResult;
    }
    else
      return [];

}


//***Basic Functions***
var escapeRegExp;
(function (){
  // Referring to the table here:
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/regexp
  // these characters should be escaped
  // \ ^ $ * + ? . ( ) | { } [ ]
  // These characters only have special meaning inside of brackets
  // they do not need to be escaped, but they MAY be escaped
  // without any adverse effects (to the best of my knowledge and casual testing)
  // : ! , = 
  // my test "~!@#$%^&*(){}[]`/=?+\|-_;:'\",<.>".match(/[\#]/g)

  var specials = [
    // order matters for these
      "-"
    , "["
    , "]"
    // order doesn't matter for any of these
    , "/"
    , "{"
    , "}"
    , "("
    , ")"
    , "*"
    , "+"
    , "?"
    , "."
    , "\\"
    , "^"
    , "$"
    , "|"
    , "="
  ]
  // I choose to escape every character with '\'
  // even though only some strictly require it when inside of []
  , regex = RegExp('[' + specials.join('\\') + ']', 'g')
  ;

  module.exports.escapeRegExp = function (str){

  return str.replace(regex, "\\$&");
  };

module.exports.escapeRegExpJSON = function(JSON){

  for(var i in JSON){

    JSON[i] = JSON[i].replace(regex, "\\$&");

  }

  return JSON;

}



}());










//***Basic Functions***

