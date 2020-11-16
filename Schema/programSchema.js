var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var programSchema = new mongoose.Schema({
    programName: { type: String, required: false },
    year: { type: Number, required: false },
    part: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model('Program', programSchema);