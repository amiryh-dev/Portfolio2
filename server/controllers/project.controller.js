import Project from "../models/project.model.js";
import extend from "lodash/extend.js";
import errorHandler from "../helpers/dbErrorHandler.js";

// Fields the client may not set directly.
const editable = (body = {}) => {
  const { _id, __v, createdAt, updatedAt, ...fields } = body;
  return fields;
};

// POST api/projects -> add new project
const create = async (req, res) => {
  try {
    const fields = editable(req.body);
    // New entries go to the end of the list unless a position is given.
    if (fields.order === undefined || fields.order === "") {
      const last = await Project.findOne().sort({ order: -1 }).select("order");
      fields.order = last ? (last.order || 0) + 1 : 0;
    }
    const project = new Project(fields);
    await project.save();
    return res.status(200).json({
      message: "Project added successfully!",
      project,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// GET api/projects -> get all projects
const list = async (req, res) => {
  try {
    let projects = await Project.find().sort({ order: 1, _id: 1 });
    res.json(projects);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// Runs for every route with :projectId, puts the project in req.project
const projectByID = async (req, res, next, id) => {
  try {
    let project = await Project.findById(id);
    if (!project)
      return res.status(400).json({
        error: "Project not found",
      });
    req.project = project;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve project",
    });
  }
};

// GET api/projects/:projectId -> get project by id
const read = (req, res) => {
  return res.json(req.project);
};

// PUT api/projects/:projectId -> update project by id
const update = async (req, res) => {
  try {
    let project = req.project;
    project = extend(project, editable(req.body));
    await project.save();
    res.json(project);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// DELETE api/projects/:projectId -> remove project by id
const remove = async (req, res) => {
  try {
    let project = req.project;
    await project.deleteOne();
    res.json({
      message: "Project deleted successfully",
      project,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// DELETE api/projects -> remove all projects
const removeAll = async (req, res) => {
  try {
    let result = await Project.deleteMany({});
    res.json({ message: result.deletedCount + " project(s) deleted successfully" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default { create, list, projectByID, read, update, remove, removeAll };
