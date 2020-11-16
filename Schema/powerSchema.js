var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var powerSchema = new mongoose.Schema({
    deviceId: { ref: 'Device', type: mongoose.Schema.ObjectId },
    energyConsumed: { type: Number, required: true },
    longitude: { type: String, required: false },
    latitude: { type: String, required: false },
    battery: { type: Number, required: false }


}, { timestamps: true });

module.exports = mongoose.model('Power', powerSchema);