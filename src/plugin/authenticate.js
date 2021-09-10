const fp = require('fastify-plugin');
const jwt = require('fastify-jwt');

module.exports = fp(async (fastify, options, next) => {
  fastify.register(jwt, {
    secret: 'supersecret',
  });

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  next();
});
