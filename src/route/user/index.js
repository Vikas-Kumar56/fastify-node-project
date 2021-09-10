const UserService = require('../../service/user.service');
const {
  postRequestBody,
  postResponseBody,
  getRequestparams,
  getResponseBody,
} = require('./user.schema');

// make sure to mark function as async
const userRoute = async (fastify) => {
  const { getUserById, createUser, getUserByEmail } = UserService(fastify);

  fastify.get(
    '/:userId',
    { schema: { params: getRequestparams, response: getResponseBody } },
    async (request, reply) => {
      const { userId } = request.params;
      try {
        const user = await getUserById(userId);
        reply.code(200).send(user);
      } catch (error) {
        reply.code(404).send(error);
      }
    }
  );

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body;

    const user = await getUserByEmail(email, password);
    const token = fastify.jwt.sign(user);
    reply.code(200).send({ token });
  });

  fastify.post(
    '/',
    { schema: { body: postRequestBody, response: postResponseBody } },
    async (request, reply) => {
      fastify.log.info('creating user');
      try {
        const userId = await createUser(request.body);
        fastify.log.info(`user created with ${userId}`);
        reply.code(201).send({ userId });
      } catch (error) {
        reply.code(400).send(error);
      }
    }
  );
};

module.exports = userRoute;
