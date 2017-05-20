var multer = require('multer');
var fs = require('fs');
var uuid = require('node-uuid');
var basic = require("./basic_functions");

//**Upload Setup**
var storage = multer.diskStorage({
  //multers disk storage settings
  // destination: function (req, file, cb){
  //     cb(null, __dirname + '/images/chat')
  // },
  filename: function (req, file, cb){
    var datetimestamp = Date.now();
    var name = uuid.v4();
    cb(null, name + '-' + datetimestamp + ('.' + file.originalname.split('.')[file.originalname.split('.').length -1]).toLowerCase());
  }
});
var upload = multer({storage: storage});
//**Upload Setup**



module.exports = function(app, auth, mongoose, dirname){

  var User = mongoose.model('User');
  var Post = mongoose.model('Post');

  app.post('/upload/excel/', upload.single('file'), auth.isAuth, function (req, res) {

  


              res.send("uploaded");
                       

  });



};

