const Users = require("../../../models/Persons/Users"),
  users = require("./users");

module.exports = [
  {
    entity: Users,
    collections: users,
    name: "users",
  },
];
