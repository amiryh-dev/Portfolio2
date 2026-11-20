import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  firstname: {
    type: String,
    trim: true,
    required: "First name is required",
  },
  lastname: {
    type: String,
    trim: true,
    required: "Last name is required",
  },
  email: {
    type: String,
    trim: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: "Email is required",
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 30,
  },
  message: {
    type: String,
    trim: true,
    minlength: 10,
    maxlength: 3000,
    required: "Message is required",
  },
});

// Third argument = collection name in MongoDB
export default mongoose.model("Contact", ContactSchema, "contacts");
