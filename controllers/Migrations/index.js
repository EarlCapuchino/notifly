const persons = require("./persons"),
  mongoose = require("mongoose");

const migrations = [
  ...persons,
  {
    collections: [],
    name: "logs",
  },
];

exports.save = (req, res) => {
  migrations.map(migration => {
    mongoose.connection.db.dropCollection(
      migration.name,
      async function (_, result) {
        if (result) {
          if (migration.collections.length > 0) {
            for (let index = 0; index < migration.collections.length; index++) {
              const collection = migration.collections[index];

              await migration.entity.create(collection);
            }
          }
        }
      }
    );
  });

  res.json("Seeder Migrations successfully done...");
};
