const DBMigrate = require('db-migrate');

const applyMigration = () =>
  new Promise((resolve, reject) => {
    const dbMigrate = DBMigrate.getInstance(true);
    dbMigrate.silence(true);

    dbMigrate.up((error, result = []) => {
      if (error) {
        reject(error);
      }

      resolve(result.length);
    });
  });

module.exports = applyMigration;
