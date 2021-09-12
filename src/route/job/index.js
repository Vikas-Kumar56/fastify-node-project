const moment = require('moment');
const JobService = require('../../service/job.service');
const { postRequestBody, queryParameter } = require('./job.schema');

// mark this function as async - required
const jobRoute = async (fastify) => {
  const { createJob, getJobs } = JobService(fastify);

  fastify.get(
    '/',
    { schema: { querystring: queryParameter } },
    async (request, reply) => {
      // authenticate request
      // append user request.user
      await fastify.authenticate(request, reply);

      const { limit, offset } = request.query;

      const jobs = await getJobs(limit, offset);
      reply.code(200).send({ jobs });
    }
  );

  fastify.post(
    '/',
    {
      schema: { body: postRequestBody },
      preHandler: (request, reply, done) => {
        const { expiredAt } = request.body;
        const todayDate = moment().format('YYYY-MM-DD');

        if (expiredAt <= todayDate) {
          reply
            .code(400)
            .send({ messaage: 'expired date must be future date' });
        }

        done();
      },
    },
    async (request, reply) => {
      // authenticate request
      await fastify.authenticate(request, reply);

      const job = request.body;

      const jobId = await createJob(job);

      reply.code(201).send({ jobId });
    }
  );
};

module.exports = jobRoute;
