var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deviceSchema = new mongoose.Schema({
    deviceId: { type: Number, required: true },
    deviceName: { type: String, required: true },
    userId: { type: String, required: false }

}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);