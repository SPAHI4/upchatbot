import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

import config from '../config';

const { url, ...options } = config.db; 

const sequelize = new Sequelize(url, options);

const db = {};

fs
  .readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) && (file !== 'index.js') && file.lastIndexOf('.js') === (file.length - 3),
  )
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
