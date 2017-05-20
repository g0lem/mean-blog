var multer = require('multer');
var fs = require('fs');
var uuid = require('node-uuid');
var excelToJson = require('convert-excel-to-json');
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

  var Company = mongoose.model('Companie');
  var Reclamatie = mongoose.model('Reclamatie');

  app.post('/upload/excel/', upload.single('file'), auth.isAuth, function (req, res) {

    if(req.file){
 
    //***loading cookie data so we can get our username***
    var cookie_data = auth.getTokenData(req); //LOAD COOKIE DATA
    var data = {};
    //***we are making the file a png in base64, it can be anything, but we must tell the system that it's an image***
    var tmp_file = req.file; 


      // fs.writeFile(__dirname + "/tmp/"+cookie_data.username,  tmp_file.path, function(err) {

      //   data.file = tmp_file;






             Company.findOne({email: req.cookies.username}, function(err, result){

                Reclamatie.find({cuiReclamant: result.cui}, function(err, reports){

                  // reports.forEach(function(b){

                  //   b.amountPaid = true;
                  //   b.save();

                  // });

                  for(var b in reports){

                    if(reports[b].fromExcel){
                      reports[b].amountPaid = true;
                      reports[b].save();
                    }
                    
                  }


                  var json = excelToJson({
                       sourceFile: req.file.path
                   });


                 var jsonInDBFormat = json.Sheet1.forEach(function(a){

                  
                    if(a.A!=''&&a.B!=''&&a.C!=''&&a.D!=''&&a.F!=''){

                        cuiVerifyString = basic.cuiRegex(basic.removeLetters(a.A));
                        nameVerifyString = basic.companynameRegex(a.B);
                        amountVerifyString = basic.amountRegex(basic.removeLetters(a.D));
                        dateVerifyString = basic.dateRegex(a.F);
                        idFacturaVerifyString = basic.idFacturaRegex(basic.removeLetters(a.C));

                        console.log(cuiVerifyString);

                        if(cuiVerifyString != "ok"){
                          return;
                        }
                        else if(nameVerifyString != "ok"){
                          return;
                        }
                        else if(amountVerifyString != "ok"){
                          return;
                        }
                        else if(dateVerifyString != "ok"){
                          return;
                        }
                        else if(idFacturaVerifyString != "ok"){
                          return;
                        }
                        else{

                          function convertDotsToDate(dateStr) {
                            if(dateStr){
                              var parts = dateStr.split(".");
                              return new Date(parts[2], parts[1] - 1, parts[0]);
                            }
                            else
                              return;
                          }

                          a.F = convertDotsToDate(a.F);

                          var properJSON = {_id: result.cui + basic.removeLetters(a.C), cuiReclamat: basic.removeLetters(a.A), reclamat: a.B, idFactura: basic.removeLetters(a.C), amount: a.D, amountRange: basic.getAmountRange(a.D), dateRegistered: a.F, fromExcel: true, amountPaid: false, reclamant: result.nume, cuiReclamant: result.cui, caenReclamant: result.caen};


                          Company.findOne({cui: properJSON.cuiReclamat}, function(err, result3){ 

                            if(err || !result3){

                              var temp = new Company({_id: properJSON.cuiReclamat, cui: properJSON.cuiReclamat, nume: properJSON.reclamat, hasAccount: false});
                              temp.save();

                            }

                          })


                          Reclamatie.findOne({_id: result.cui + basic.removeLetters(a.C)}, function(err, result2){


                              if(result2 && !err){
                               

                                for(var k in properJSON){
                                    result2[k]=properJSON[k];
                                }
                               
                                result2.save();
                              }
                              else{
                                var report = new Reclamatie(properJSON);
                                report.save();
                              }
                          })
                        }
                      }
                    

                 });
               });

             })



              res.send("uploaded");
                       

      }
  });



};

