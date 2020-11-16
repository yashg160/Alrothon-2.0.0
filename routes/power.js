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


router.get('/', async function (req, res) {
    var populateQuery = [{ path: 'deviceId', select: ['deviceId', 'deviceName', 'userId'] }];

    try {
        const allData = await Power.find({}).populate(populateQuery).lean();
        return res.json({
            status: true,
            data: allData,
            err: {},
            msg: "Data fetched successfully.",
        });
    } catch (err) {
        console.log(err)
        return res.json({
            status: false,
            data: {},
            err,
            msg: "Unable to fetch Data.",
        });
    }
});

router.get('/:id', async function (req, res) {
    var populateQuery = [{ path: 'deviceId', select: ['deviceId', 'deviceName', 'userId'] }];

    try {
        const allData = await Power.find({ deviceId: req.params.id }).populate(populateQuery).lean();
        return res.json({
            status: true,
            data: allData,
            err: {},
            msg: "Data fetched successfully.",
        });
    } catch (err) {
        console.log(err)
        return res.json({
            status: false,
            data: {},
            err,
            msg: "Unable to fetch Data.",
        });
    }
});

router.post('/add', async function (req, res) {
    const {
        deviceId,
        energyConsumed,
        longitude,
        latitude,
        battery
    } = req.body;

    try {
        var newData = new Power({
            deviceId: deviceId,
            energyConsumed: energyConsumed,
            longitude: longitude,
            latitude: latitude,
            battery: battery
        })
        console.log(newData)
        newData.save();
        return res.json({
            status: true,
            data: newData,
            err: {},
            msg: "Data added successfully.",
        });
    } catch {
        return res.json({
            status: false,
            data: {},
            err,
            msg: "Unable to add data.",
        });
    }
});



module.exports = router;
