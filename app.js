
// const express = require('express');
// const exphbs  = require('express-handlebars');
// const bodyParser = require('body-parser');
// const path = require("path");
// const crypto = require("crypto");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const GridFsStorage = require("multer-gridfs-storage");
// const Grid = require("gridfs-stream");
// const methodOverride = require("method-override");
// const app = express();
 
// // middleware
// app.use(bodyParser.json());
// app.use(methodOverride('_method'));

// // mongo URI
// const mongoURI = "mongodb+srv://evan:evan@mern-xupmz.mongodb.net/test?retryWrites=true&w=majority";
// mongoose.connect(mongoURI,{useNewUrlParser:true});
// mongoose.set('useNewUrlParser', true);
// const conn = mongoose.connection;


// // init Gfs
// let gfs;
// conn.once('open',()=> {
//   /*gfs = new mongoose.mongo.GridFSBucket(conn.db, {
//     bucketName: 'uploads'
//   });*/
//   gfs = Grid(conn.db,mongoose.mongo);
//   gfs.collection('uploads');
// });


// // Gfs storage
// const storage = new GridFsStorage({
//   url:mongoURI,
//   file:(req,file)=> {
//     return new Promise((resolve,reject)=> {
//       crypto.randomBytes(16,(err,buf)=> {
//         if(err) return reject(err);
//         const filename = buf.toString('hex')+path.extname(file.originalname);
//         const fileInfo = {
//           filename : filename,
//           bucketName : 'uploads'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });
// const upload = multer({storage});


// app.engine('handlebars', exphbs({defaultLayout:"main"}));
// app.set('view engine', 'handlebars');
 
// app.get('/', function (req, res) {
//     res.render('home');
// });
 
// app.post('/upload',upload.single('file'),(req,res)=> {
//   //res.json({file:req.file});
//   res.redirect('/');
// });

// // @route GET /files
// // @desc  Display all files
// app.get('/files',(req,res)=> {
//   gfs.files.find().toArray((err,files)=>{
//     if(!files || files.length === 0) return res.status(404).json({err:'no files exist'});
//     return res.json(files);
//   });
// });

// app.listen(3000);







// var express = require('express');
// var fs = require('fs');
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// // img path
// var imgPath = './images/test.jpeg';

// // connect to mongo
// const mongoURI = "mongodb+srv://evan:evan@mern-xupmz.mongodb.net/test?retryWrites=true&w=majority";
// mongoose.connect(mongoURI,{useNewUrlParser:true});

// // example schema
// var schema = new Schema({
//     img: { data: Buffer, contentType: String }
// });

// // our model
// var A = mongoose.model('A', schema);

// mongoose.connection.on('open', function () {
//   console.error('mongo is open');

//   // empty the collection
//   A.remove(function (err) {
//     if (err) throw err;

//     console.error('removed old docs');

//     // store an img in binary in mongo
//     var a = new A;
//     a.img.data = fs.readFileSync(imgPath);
//     a.img.contentType = 'image/png';
//     a.save(function (err, a) {
//       if (err) throw err;

//       console.error('saved img to mongo');

//       // start a demo server
//       var server = express.createServer();
//       server.get('/', function (req, res, next) {
//         A.findById(a, function (err, doc) {
//           if (err) return next(err);
//           res.contentType(doc.img.contentType);
//           res.send(doc.img.data);
//         });
//       });

//       server.on('close', function () {
//         console.error('dropping db');
//         mongoose.connection.db.dropDatabase(function () {
//           console.error('closing db connection');
//           mongoose.connection.close();
//         });
//       });

//       server.listen(3333, function (err) {
//         var address = server.address();
//         console.error('server listening on http://%s:%d', address.address, address.port);
//         console.error('press CTRL+C to exit');
//       });

//       process.on('SIGINT', function () {
//         server.close();
//       });
//     });
//   });

// });

/*
const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const exphbs = require('express-handlebars');


const imgPath = './images/test.jpeg';

const mongoURI = "mongodb+srv://evan:evan@mern-xupmz.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoURI,{useNewUrlParser:true});

const news = new Schema({
  img: { data: Buffer, contentType: String }
});

const News = mongoose.model('news', news);

var a = new News;
     a.img.data = fs.readFileSync(imgPath);
     a.img.contentType = 'image/png';
     a.save();

     
const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

  app.get('/',(req,res)=> {
    News.findById(a, function (err, doc) {
      res.render('index',{
        image:doc.img.data
      })
      // res.contentType(doc.img.contentType);
      // res.send(doc.img.data);
    });
    // News.findById(a)
    // .then(() => {
    //   res.contentType(a.contentType);
    //   res.send(a.data);
    // })
  });

  app.listen(5000);
*/

const express = require('express');

const multer = require('multer');
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');
const methodOverride = require('method-override');
const Schema = mongoose.Schema;

const app = express();

// Middleware

app.use(methodOverride('_method'));

// View Engine
app.set('view engine',"ejs");

// Mongo URI
const mongoURI = 
"mongodb+srv://evan:evan@mern-xupmz.mongodb.net/test?retryWrites=true&w=majority";

// Create mongo connection
const conn = mongoose.createConnection(mongoURI,{useNewUrlParser:true});

// Init gfs
let gfs;

conn.once('open',() => {
  // Init Stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
  /*gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName:"uploads"
  });*/
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  options : {
    useNewUrlParser:true
  },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

const NewsSchema = new Schema({
  title : {
    type: String
  },
  fileID : {
    type: Schema.Types.ObjectId
  }
});

News = mongoose.model('news', NewsSchema);

// @route GET /
// @desc  Loads form
app.get('/',(req,res)=> {
  gfs.files.find().toArray((err,files)=> {
    // Check if files exist
    if(!files || files.length === 0)
      res.render('index',{files:false});
    else {
      files.map(file=> {
        if(file.contentType==='image/jpeg' || file.contentType==='image/png') {
          file.isImage = true;
      }
         else {
          file.isImage = false;
        }
      });
      let count = 0;
      return res.render('index',{files:files,count:count});
    }
  });
});

// @route POST /upload
// @desc  Uploads file to DB
app.post('/upload',upload.single('file'),(req,res)=> {
  const news = new News({
    title: req.body.title,
    fileID : req.file._id
  });
  news.save();
  console.log(news.title);
  console.log(news.fileID);
  res.redirect('/');
});

// @route GET /files
// @desc  Display all files in JSON
app.get('/files',(req,res)=> {
  gfs.files.find().toArray((err,files)=> {
    // Check if files exist
    if(!files || files.length === 0)
      return res.status(404).json({err:"no files exist"});
    return res.json(files);
  });
});

// @route GET /files/:filename
// @desc  Display a single file
app.get('/files/:filename',(req,res)=> {
  gfs.files.findOne({filename:req.params.filename},(err,file) => {
    // Check if file exists
    if(!file || file.length === 0)
      return res.status(404).json({err:"File not found"});
    // File exists
    return res.json(file);
    
  });
});

// @route GET /image/:filename
// @desc  Display a single image
app.get('/images/:filename',(req,res)=> {
  gfs.files.findOne({filename:req.params.filename},(err,file) => {
    // Check if file exists
    if(!file || file.length === 0)
      return res.status(404).json({err:"File not found"});
    
      // Check if file is an image
    if(file.contentType === 'image/jpeg'
    || file.contentType === 'image/png') {
      var readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({err:"Not an image"});
    }
  });
});

// @route GET /upload
// @desc  Uploads file to DB
app.post('/upload',upload.single('file'),(req,res)=> {
  res.redirect('/');
});

// @route DELETE/files/:id
// @desc  Delete file
app.delete('files/:id',(req,res)=> {
  gfs.remove({_id:req.params.id,root:'uploads'},(err,gridStore) => {
    if (err) return res.status(404).json({err:err});
    res.redirect('/');
  });
});

const PORT = process.env.port || 5000;

app.listen(PORT,()=> console.log(`Server started on port ${PORT}`));
