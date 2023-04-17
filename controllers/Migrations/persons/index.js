const Members = require("../../../models/Persons/Members"),
  members = require("./members");

module.exports = [
  {
    entity: Members,
    collections: members,
    name: "members",
  },
];
