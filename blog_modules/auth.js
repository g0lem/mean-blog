var jwt = require('jsonwebtoken');

var token_secret = "CKp2ZrcW8AndFdsSwZcudSur";



var auth = function(User){

	auth.User = User;

};

auth.prototype.logOut = function(res){
	res.clearCookie('sesid');
	//return "loggedOut";
}

auth.prototype.generateToken = function(obj){
	return jwt.sign(obj, token_secret); //change it to be random
}

auth.prototype.getToken = function(req){
	return req.cookies.sesid;
}

auth.prototype.getTokenData = function(req){
	return jwt.verify(req.cookies.sesid, token_secret);
}


auth.prototype.isAuth = function (req, res, next){

if( req.cookies.sesid ){
  auth.User.findOne({'sesstoken' : req.cookies.sesid}, function(err, user){
    if(err || user===null){
      res.redirect('/login');
    }
    else{
      res.cookie('username', user.email);
      next();
    }
  });
}
else
  res.redirect('/login');
}

auth.prototype.isNotAuth = function (req, res, next){

if( req.cookies.sesid ){
  auth.User.findOne({'sesstoken' : req.cookies.sesid}, function(err, user){
    if(err || user===null){
      next();
    }
    else{
        res.redirect('/');
    }
  });
}
else
  next();
}


module.exports = auth;