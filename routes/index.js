var express = require('express');
var router = express.Router();


var Class = require('../Schema/classSchema');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/class', async function (req, res) {
  var populateQuery = [{ path: 'routineFor', select: ['programName', 'year', 'part'] }, { path: 'teacherName', select: ['teacherName', 'shortName'] }];

  try {
    const allClasses = await Class.find({}).populate(populateQuery).lean();
    return res.json({
      status: true,
      data: allClasses,
      err: {},
      msg: "Classes fetched successfully.",
    });
  } catch (err) {
    console.log(err)
    return res.json({
      status: false,
      data: {},
      err,
      msg: "Unable to fetch classes.",
    });
  }
});

router.get('/api/class/:id', async function (req, res) {
  var populateQuery = [{ path: 'routineFor', select: ['programName', 'year', 'part'] }, { path: 'teacherName', select: ['teacherName', 'shortName'] }];

  try {
    const id = req.params.id;
    const allPrograms = await Class.findById({ _id: id }).populate(populateQuery).lean();
    return res.json({
      status: true,
      data: allPrograms,
      err: {},
      msg: "Class fetched successfully.",
    });
  } catch (err) {
    return res.json({
      status: false,
      data: {},
      err,
      msg: "Unable to fetch class.",
    });
  }
});

router.post('/api/class', async function (req, res) {
  const {
    routineFor,
    subjectName,
    teacherName,
    classCode,
    classGroup,
    startingPeriod,
    noOfPeriod,
    courseCode,
    link1,
    weekDay
  } = req.body;

  try {
    var newClass = new Class({
      routineFor: routineFor,
      subjectName: subjectName,
      teacherName: teacherName,
      classCode: classCode,
      classGroup: classGroup,
      startingPeriod: startingPeriod,
      noOfPeriod: noOfPeriod,
      courseCode: courseCode,
      link1: link1,
      weekDay: weekDay
    })
    console.log(newClass)
    newClass.save();
    return res.json({
      status: true,
      data: newClass,
      err: {},
      msg: "Class added successfully.",
    });
  } catch {
    return res.json({
      status: false,
      data: {},
      err,
      msg: "Unable to add class.",
    });
  }
});

router.post('/api/class/edit/:id', async function (req, res) {
  Class.findById(req.params.id, function (err, p) {
    if (!p) {
      return res.json({
        status: false,
        data: {},
        msg: "Unable to update Class.",
      });
    } else {
      p.routineFor = req.body.routineFor;
      p.subjectName = req.body.subjectName;
      p.teacherName = req.body.teacherName;
      p.classCode = req.body.classCode;
      p.classGroup = req.body.classGroup;
      p.startingPeriod = req.body.startingPeriod;
      p.noOfPeriod = req.body.noOfPeriod;
      p.courseCode = req.body.courseCode;
      p.link1 = req.body.link1;
      p.weekDay = req.body.weekDay
      p.save(function (err) {
        if (err) {
          return res.json({
            status: false,
            data: {},
            msg: "Unable to update Class.",
          });
        } else {
          return res.json({
            status: true,
            data: p,
            msg: "Class updated Sucessfully",
          });
        }
      });
    }
  })
});

router.delete('/api/class/delete/:id', async function (req, res) {
  try {
    await Class.deleteOne({ _id: req.params.id });
    return res.json({
      status: true,
      // data: deletedObject,
      msg: "Class deleted successfully.",
    });
  } catch (err) {
    return res.json({
      status: false,
      data: {},
      msg: "Unable to delete class.",
    });
  }
});

module.exports = router;
