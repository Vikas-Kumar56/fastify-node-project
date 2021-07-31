const tempDao = require('../dao/temp.dao');

const tempService = (fastify) => {
  const dao = tempDao(fastify);

  const getAll = () => dao.getAll();

  const save = (title) => dao.save(title);

  return { getAll, save };
};

module.exports = tempService;
