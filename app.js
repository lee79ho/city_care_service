
// init project
const express = require("express");
var multer = require('multer')
const cors = require('cors');

const app = express();
// setup the middleware 
app.use(express.json())
app.use(express.urlencoded())

const PORT = process.env.PORT || 8080

// static files 
app.use('/uploads',express.static('uploads'))

app.use(cors())

let incidents = []

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

app.get('/incidents', (req, res) => {
  res.json(incidents)
});

app.get('/clear',(req,res) => {
  incidents = [] // clear all incidents 
  res.send("Incidents has been cleared...")
})

app.post('/incidents',upload.single('image'),(req,res) => {

  let incident = {title: req.body.title, description: req.body.description,imageURL: `/uploads/${req.file.filename}`}
  incidents.push(incident)
  res.json({success: true})

});

app.post('/profile', upload.single('image'), function (req, res, next) {

  const file = req.file
  console.log(file)
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send("done...")

})

// listen for requests :)
app.listen(PORT, function () {
  console.log("Your app is listening on port ");
});
