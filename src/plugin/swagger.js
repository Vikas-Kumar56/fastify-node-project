const fp = require('fastify-plugin');
const swagger = require('fastify-swagger');

module.exports = fp((fastify, options, next) => {
  fastify.register(swagger, {
    routePrefix: '/swagger',
    swagger: {
      info: {
        title: 'fastify project',
        description: 'Fastify swagger API',
        version: '0.1.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
      host: 'localhost:5000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [{ name: 'Temp', description: 'Temp related end-points' }],
      definitions: {
        Temp: {
          type: 'object',
          required: ['id', 'title'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
          },
        },
      },
    },
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    exposeRoute: true,
  });

  next();
});
