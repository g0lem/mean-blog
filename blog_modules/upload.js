var multer = require('multer');
var fs = require('fs');
var uuid = require('node-uuid');
var basic = require("./basic_functions");
var Grid = require("gridfs-stream");



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


  Grid.mongo = mongoose.mongo;

  var gfs = Grid(mongoose.connection.db);



  app.post('/upload/photos/', upload.single('file'), auth.isAuth, function (req, res) {

  var writestream = gfs.createWriteStream(req.file.filename);
  fs.createReadStream(req.file.path).pipe(writestream);

    writestream.on('close', function(){
        res.send(req.file.filename);
    })

                       

  });



app.get('*/getPhoto/:filename', function (req, res){

  // res.sendFile(__dirname + "/images/chat/"+req.params.imagename);
  // var video_extensions = [".wav", ".webm", ".ogg", ".mp3", ".mp4", ".flac"];
  // var file_name = req.params.imagename;

  // var file_extension = '.' + req.params.imagename.split('.')[req.params.imagename.split('.').length -1];

  // var fs_write_stream = fs.createWriteStream(__dirname + "/images/chat/imagez"+file_extension);
    var readstream = gfs.createReadStream({filename: req.params.filename});

    readstream.pipe(res);

    readstream.on("error", function(err) { 
        res.end();
    });

  //res.sendFile(readstream);
  // fs.access(__dirname + "/images/"+req.params.location+ "/"+req.params.imagename, fs.F_OK, function(err){
  //     if (!err){
  //       res.sendFile(__dirname + "/images/"+req.params.location+ "/"+req.params.imagename);
  //     }
  // else {
  //         //if(location  === "profile") da-i default profile pic
  //         res.sendFile(__dirname + "/img/" + req.params.location );
  //     }
  // });
  // }

});




};

