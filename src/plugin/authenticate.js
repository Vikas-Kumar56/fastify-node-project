const fp = require('fastify-plugin');
const jwt = require('fastify-jwt');

module.exports = fp(async (fastify, options, next) => {
  fastify.register(jwt, {
    // TODO: move to .env from code (don't don't put your secret in code)
    secret: 'supersecretvalue',
  });

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      // extract jwt token from Authorization header
      // remove Bearer from front of token
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  next();
});
