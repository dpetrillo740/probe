var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

var dbConfig = require('./server/config/db');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
   console.log('connection to mongodb successful');
});

var CurrentMeatDef = require('./server/models/currentMeatDef');

var port = process.env.PORT || 3000;

var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('url: ' + req.url + ', method: ' + req.method + ', body: ' + req.body);
  next(); // make sure we go to the next routes and don't stop here
});

//handles requests for static files
app.use('/app', express.static(__dirname + '/app'));
app.use('/', express.static(__dirname));

//seed db
console.log('Seeding DB...');
var meatDef = new CurrentMeatDef({
  targetEndTemp: 180,
  methodOfCooking: 'Grilled',
  heatSourceTemp: 350,
  meatMass: 3000,
  meatShape: 'Bird-like',
  meatThickness: 3
});

CurrentMeatDef.remove(function () {
  meatDef.save(function () {
    console.log('seeded default current meat definition');
  })
});

router.route('/currentMeatDefs')

  .get(function (req, res) {
    CurrentMeatDef.findOne(function (err, currentMeatDef) {
      res.json(currentMeatDef);
    });
  })

  .put(function (req, res) {
    CurrentMeatDef.findOne({}, function (err, doc) {
      doc.targetEndTemp = req.body.targetEndTemp;
      doc.methodOfCooking = req.body.methodOfCooking;
      doc.heatSourceTemp = req.body.heatSourceTemp;
      doc.meatMass = req.body.meatMass;
      doc.meatShape = req.body.meatShape;
      doc.meatThickness = req.body.meatThickness;

      doc.save(function () {
        res.json({ message: 'meatdef created!!' });
      });
    });
  });

app.use('/api', router);

// frontend routes =========================================================
// route to handle all angular requests
//app.get('*', function(req, res) {
//  res.sendfile('./app/index.html'); // load our public/index.html file
//});

var server = app.listen(port, function () {
   console.log('Listening on port %d', server.address().port);
});