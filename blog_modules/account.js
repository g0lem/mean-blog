var bcrypt = require('bcryptjs');
var basic = require("./basic_functions");
var uuid = require('node-uuid');

module.exports = function(app, auth, mongoose){

  var User = mongoose.model('User');

  //***Account Creation***
  app.post('/creating', function (req, res){

    var userdata = req.body;
    if(userdata.username&&userdata.password&&userdata.passwordVerif){
      if(userdata.password == userdata.passwordVerif){
        passwordVerifyString = basic.passwordRegex(userdata.password);
        usernameVerifyString = basic.usernameRegex(userdata.username);

        if(usernameVerifyString != "ok"){
          res.send(usernameVerifyString);
        }
        else if(passwordVerifyString != "ok"){
                res.send(passwordVerifyString);
        }
        else {
          userdata.password = userdata.password.trim().replace(/\\(.)/mg); //Impossible to have "\" but better safe than sorry.
          var salt = bcrypt.genSaltSync(10);
          var hashedPassword = bcrypt.hashSync(userdata.password, salt);
          var escapedUsername = basic.escapeRegExp(userdata.username);

          User.find({ username: escapedUsername.toLowerCase() },function(err,data){
            if(err){
              console.log(err);
            }
            if(data.length!=0){
              res.send("Username already exists!");
            }
            else {
              
              //Generate Token 
                      
              var today = new Date();
              var exp = new Date(today);
              exp.setDate(today.getDate() + 60);

              var token = auth.generateToken({
                ip: req.connection.remoteAddress,
                username:  userdata.username,
                exp: parseInt(exp.getTime() / 1000),
              });


              res.cookie('sesid', token);

              //End generate token

              // create reusable transporter object using the default SMTP transport

              // send mail with defined transport object
              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      return console.log(error);
                  }
                  else{
                    console.log('Message %s sent: %s', info.messageId, info.response);
                    var userInsertObject = new User({ username: escapedUsername.toLowerCase(), password: hashedPassword, sesstoken: token });
                    userInsertObject.save();
                    res.send("Account created!");
                  }
              });

              
            }
          });
        }
      }
      else {
        res.send("Passwords don't match.");
      }
    }
    else{
      res.send("Don't leave the fields empty!");
    }
  });
  //***Account Creation***



  //***Account Sessions***
  app.post('/loggingIn', function (req, res){

    var userdata=req.body;


    if(userdata.password&&userdata.username){

      var escapedUsername = basic.escapeRegExp(userdata.username);
    
      User.findOne({ username: userdata.username.toLowerCase() },function(err,data){

      if(err){
        console.log(err);
      }

        if(data==undefined){
            res.send("Account doesn't exist!")
        }
        else {
          bcrypt.compare(userdata.password,data.password, function(err, pwdcheck){
            if(err){
                console.log(err);
            }
            if(pwdcheck){
              
              //Generate Token 
              var today = new Date();
              var exp = new Date(today);
              exp.setDate(today.getDate() + 60);
              var token = auth.generateToken({
                ip: req.connection.remoteAddress,
                username:  userdata.username,
                exp: parseInt(exp.getTime() / 1000),
              });
              res.cookie('sesid', token);
              data.sesstoken=token;
              data.save();
              //End generate token

              res.send("Logged in.");//To be replaced with actual logging in
            }
            else {
              res.send("Username and password do not match.");
            }
          });
        }
      });
    }
    else {
          res.send("Don't leave the fields empty!");
    }
  });
  //***Account Sessions***


  //***Account Management***
  app.post('/changePassword', function (req, res){

    var userdata = req.body;
    var cookie_data = auth.getTokenData(req); 

    if(userdata.verify1 != userdata.verify2 && userdata.new1 != userdata.new2){
      res.send("passwords don't match");
      return;
    }
    else if(userdata.new1 && cookie_data.username){ //Fix this security issue

      var escapedUsername = basic.escapeRegExp(cookie_data.username);

      User.findOne({ username: cookie_data.username.toLowerCase(), sesstoken: req.cookies.sesid },function(err,data){
        if(err){
          console.log(err);
        }
        else {
          bcrypt.compare(userdata.verify1, data.password, function(err, pwdcheck){
            console.log(pwdcheck);
            if(pwdcheck){

              userdata.new1 = userdata.new1.trim().replace(/\\(.)/mg); //Impossible to have "\" but better safe than sorry.
              var salt = bcrypt.genSaltSync(10);
              var hashedPassword = bcrypt.hashSync(userdata.new1, salt);
              data.password = hashedPassword;
              res.send("success");
              data.save();

            }
          });
        }
      });
    }
    else{
      res.send("Not Same Account");
    }
  });
  //***Account Management***

};

