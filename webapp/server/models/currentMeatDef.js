var db = require('mongoose');
var Schema = db.Schema;

var CurrentMeatDefSchema = new Schema({
  targetEndTemp: Number,
  methodOfCooking: String,
  heatSourceTemp: Number,
  meatMass: Number,
  meatShape: String,
  meatThickness: Number
});

module.exports = db.model('CurrentMeatDef', CurrentMeatDefSchema);
