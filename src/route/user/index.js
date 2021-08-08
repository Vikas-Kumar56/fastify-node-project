const UserService = require('../../service/user.service');
const {
  postRequestBody,
  postResponseBody,
  getParams,
  getResponseBody,
} = require('./user.schema');

const userRoute = async (fastify) => {
  const { getUserById, createUser } = UserService(fastify);

  fastify.get(
    '/:userId',
    { schema: { params: getParams, response: getResponseBody } },
    async (request, reply) => {
      const { userId } = request.params;
      fastify.log.info(` getting user data for ${userId}`);
      try {
        const user = await getUserById(userId);
        reply.code(200).send(user);
      } catch (error) {
        reply.code(404).send(error);
      }
    }
  );

  fastify.post(
    '/',
    { schema: { body: postRequestBody, response: postResponseBody } },
    async (request, reply) => {
      fastify.log.info('Creating user!');
      try {
        const userId = await createUser(request.body);
        fastify.log.info(`user created with id: ${userId}`);
        reply.code(201).send({ userId });
      } catch (error) {
        reply.code(400).send(error);
      }
    }
  );
};

module.exports = userRoute;
