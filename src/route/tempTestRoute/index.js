const tempService = require('../../service/temp.service');

const body = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      minLength: 10,
    },
  },
  required: ['title'],
};

const postResponse = {
  201: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
};

const route = async (fastify) => {
  // get route  api/v1/test/
  const { getAll, save } = tempService(fastify);

  fastify.get('/', async (request, reply) => {
    const allTest = await getAll();

    reply.code(200).send(allTest);
  });

  // get route api/v1/test
  fastify.post(
    '/',
    { schema: { body, response: postResponse } },
    async (request, reply) => {
      fastify.log.info(`request with body ${request}`);
      const { title } = request.body;

      const id = await save(title);

      reply.code(201).send(id);
    }
  );
};

module.exports = route;
