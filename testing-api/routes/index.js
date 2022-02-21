const express = require('express');
const router = express.Router();

const { Visitor } = require('../model/visitor');

//get all visitor
router.get('/api/visitor', (req, res) => {
  Visitor.find({}, (err, data) => {
    if (!err) {
      res.status(200).json({ code: 200, message: "All Visitors", visitors: data });
    } else {
      res.status(400).json({ code: 400, message: "Bad Request", err: err });
    }
  });
});

//get single visitor
router.get('/api/visitor/:id', (req, res) => {
  Visitor.findById(req.params.id, (err, data) => {
    if (!err) {
      res.status(200).json({ code: 200, message: "Visitor", visitor: data });
    } else {
      res.status(400).json({ code: 400, message: "Bad Request", err: err });
    }
  });
});

//create visitor
router.post('/api/visitor/add', (req, res) => {
  const visitor = new Visitor({
    name: req.body.name,
    phone_number: req.body.phone_number,
    queue_line: req.body.queue_line
  });
  visitor.save((err, data) => {
    if (!err) {
      res.status(200).json({ code: 200, message: "Visitor Added Successfuly", add_visitor: data });
    } else {
      res.status(400).json({ code: 400, message: "Bad Request", err: err });
    }
  });
});

//edit visitor
router.put('/api/visitor/edit/:id', (req, res) => {
  const visitor = {
    name: req.body.name,
    phone_number: req.body.phone_number,
    queue_line: req.body.queue_line
  };

  Object. keys(visitor).forEach((prop) => {
    if(!prop) {
      delete prop;
    }
  });

  Visitor.findByIdAndUpdate(req.params.id, { $set: visitor }, { new: true }, (err, data) => {
    if (!err) {
      res.status(200).json({ code: 200, message: "Visitor Updated Successfuly", updated_visitor: data });
    } else {
      res.status(400).json({ code: 400, message: "Bad Request", err: err });
    }
  });
});

//delete visitor
router.delete('/api/visitor/delete/:id', (req, res) => {
  Visitor.findByIdAndRemove(req.params.id, (err, data) => {
    if (!err) {
      res.status(200).json({ code: 200, message: "Visitor Deleted Successfuly", deleted_visitor: data });
    } else {
      res.status(400).json({ code: 400, message: "Bad Request", err: err });
    }
  });
});

module.exports = router;
