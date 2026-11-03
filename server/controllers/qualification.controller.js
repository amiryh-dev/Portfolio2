import Qualification from "../models/qualification.model.js";
import extend from "lodash/extend.js";
import errorHandler from "../helpers/dbErrorHandler.js";

// POST api/qualifications -> add new qualification
const create = async (req, res) => {
  const qualification = new Qualification(req.body);
  try {
    await qualification.save();
    return res.status(200).json({
      message: "Qualification added successfully!",
      qualification,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// GET api/qualifications -> get all qualifications
const list = async (req, res) => {
  try {
    let qualifications = await Qualification.find();
    res.json(qualifications);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// Runs for every route with :qualificationId, puts the qualification in req.qualification
const qualificationByID = async (req, res, next, id) => {
  try {
    let qualification = await Qualification.findById(id);
    if (!qualification)
      return res.status(400).json({
        error: "Qualification not found",
      });
    req.qualification = qualification;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve qualification",
    });
  }
};

// GET api/qualifications/:qualificationId -> get qualification by id
const read = (req, res) => {
  return res.json(req.qualification);
};

// PUT api/qualifications/:qualificationId -> update qualification by id
const update = async (req, res) => {
  try {
    let qualification = req.qualification;
    qualification = extend(qualification, req.body);
    await qualification.save();
    res.json(qualification);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// DELETE api/qualifications/:qualificationId -> remove qualification by id
const remove = async (req, res) => {
  try {
    let qualification = req.qualification;
    await qualification.deleteOne();
    res.json({
      message: "Qualification deleted successfully",
      qualification,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// DELETE api/qualifications -> remove all qualifications
const removeAll = async (req, res) => {
  try {
    let result = await Qualification.deleteMany({});
    res.json({ message: result.deletedCount + " qualification(s) deleted successfully" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default { create, list, qualificationByID, read, update, remove, removeAll };
