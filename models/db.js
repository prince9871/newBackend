const mongoose = require('mongoose');

const apiSchema = new mongoose.Schema({
  name: String,
  code: Number,
  quantity: Number,
});

module.exports=mongoose.model('NewDbapi',apiSchema)

