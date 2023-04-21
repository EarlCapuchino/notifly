// Importing the Entity model from "../models/Logs"
const Entity = require("../models/Logs");

// Handler function for browsing all logs
exports.browse = (req, res) =>
  // Finding all logs using Entity.find(), with options
  Entity.find()
    // Populating the user field with fullName, role, and email fields from the User model
    .populate({
      path: "user",
      select: "fullName role email",
    })
    // Selecting only the createdAt field and excluding the updatedAt and __v fields
    .select("-updatedAt -__v")
    // Sorting logs in descending order by createdAt
    .sort({ createdAt: -1 })
    // Converting Mongoose documents to plain JavaScript objects
    .lean()
    // Sending JSON response containing the logs array
    .then(logs => res.json(logs))
    // Handling any errors with a 400 status code and error message
    .catch(error => res.status(400).json({ error: error.message }));

// Handler function for finding logs by model
exports.find = (req, res) =>
  // Finding all logs using Entity.find() with a query for a specific model
  Entity.find()
    .byModel(req.query.model)
    // Populating the user field with fullName, role, and email fields from the User model
    .populate({
      path: "user",
      select: "fullName role email",
    })
    // Selecting only the createdAt field and excluding the updatedAt and __v fields
    .select("-updatedAt -__v")
    // Sending JSON response containing the logs array
    .then(logs => res.json(logs))
    // Handling any errors with a 400 status code and error message
    .catch(error => res.status(400).json({ error: error.message }));

// Handler function for finding logs by user ID
exports.user = (req, res) =>
  // Finding all logs using Entity.find() with a query for a specific user ID
  Entity.find()
    .byUser(req.query.id)
    // Excluding the updatedAt, __v, and user fields
    .select("-updatedAt -__v -user")
    // Sending JSON response containing the logs array
    .then(logs => res.json(logs))
    // Handling any errors with a 400 status code and error message
    .catch(error => res.status(400).json({ error: error.message }));
