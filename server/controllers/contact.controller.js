import Contact from "../models/contact.model.js";
import extend from "lodash/extend.js";
import errorHandler from "../helpers/dbErrorHandler.js";

// POST api/contacts -> add new contact
const create = async (req, res) => {
  const contact = new Contact(req.body);
  try {
    await contact.save();
    return res.status(200).json({
      message: "Contact added successfully!",
      contact,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// GET api/contacts -> get all contacts
const list = async (req, res) => {
  try {
    let contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// Runs for every route with :contactId, puts the contact in req.contact
const contactByID = async (req, res, next, id) => {
  try {
    let contact = await Contact.findById(id);
    if (!contact)
      return res.status(400).json({
        error: "Contact not found",
      });
    req.contact = contact;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve contact",
    });
  }
};

// GET api/contacts/:contactId -> get contact by id
const read = (req, res) => {
  return res.json(req.contact);
};

// PUT api/contacts/:contactId -> update contact by id
const update = async (req, res) => {
  try {
    let contact = req.contact;
    contact = extend(contact, req.body);
    await contact.save();
    res.json(contact);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// DELETE api/contacts/:contactId -> remove contact by id
const remove = async (req, res) => {
  try {
    let contact = req.contact;
    await contact.deleteOne();
    res.json({
      message: "Contact deleted successfully",
      contact,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// DELETE api/contacts -> remove all contacts
const removeAll = async (req, res) => {
  try {
    let result = await Contact.deleteMany({});
    res.json({ message: result.deletedCount + " contact(s) deleted successfully" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default { create, list, contactByID, read, update, remove, removeAll };
