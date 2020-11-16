var express = require('express');
var router = express.Router();


var Power = require('../Schema/powerSchema');
var Device = require('../Schema/deviceSchema');


/* GET home page. */
router.get('/device', async function (req, res, next) {
    try {
        const allDevice = await Device.find({});
        return res.json({
            status: true,
            data: allDevice,
            err: {},
            msg: "Devices fetched successfully.",
        });
    } catch (err) {
        return res.json({
            status: false,
            data: {},
            err,
            msg: "Unable to fetch devices.",
        });
    }
});

router.post('/device/add', async function (req, res) {
    const {
        deviceId,
        deviceName,
        userId
    } = req.body;

    try {
        var newDevice = new Device({
            deviceId: deviceId,
            deviceName: deviceName,
            userId: userId
        })
        console.log(newDevice)
        newDevice.save();
        return res.json({
            status: true,
            data: newDevice,
            err: {},
            msg: "Device added successfully.",
        });
    } catch {
        return res.json({
            status: false,
            data: {},
            err,
            msg: "Unable to add device.",
        });
    }
});



module.exports = router;
