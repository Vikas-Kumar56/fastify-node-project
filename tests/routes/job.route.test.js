const Fastify = require('fastify');
const moment = require('moment');

const jobRoute = require('../../src/route/job');
const JobService = require('../../src/service/job.service');
const authenticate = require('../../src/plugin/authenticate');

jest.mock('../../src/service/job.service');

const createJob = jest.fn();
const getJobs = jest.fn();

JobService.mockImplementation(() => ({ createJob, getJobs }));

let app;

describe('job route', () => {
  beforeAll(async () => {
    app = Fastify();
    app.register(jobRoute, { prefix: 'api/v1/jobs' });
    app.register(authenticate);
    await app.ready();
  });

  it('should return 201 when job data is valid', async () => {
    createJob.mockImplementation(() => 'uuid');
    const futureDate = moment().add(4, 'day').format('YYYY-MM-DD');

    const token = app.jwt.sign({ foo: 'bar' });

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/jobs',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: {
        title: 'title',
        description: 'description',
        skills: 'skills',
        minBudget: 100,
        maxBudget: 200,
        expiredAt: futureDate,
        userId: 'uuid',
      },
    });

    expect(res.statusCode).toEqual(201);
  });

  it('should return 400 when some required field is missing', async () => {
    createJob.mockImplementation(() => 'uuid');
    const futureDate = moment().add(4, 'day').format('YYYY-MM-DD');

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/jobs',
      payload: {
        description: 'description',
        skills: 'skills',
        minBudget: 100,
        maxBudget: 200,
        expiredAt: futureDate,
        userId: 'uuid',
      },
    });

    expect(res.statusCode).toEqual(400);
  });

  it('should return 400 when expire date format is incorrect', async () => {
    createJob.mockImplementation(() => 'uuid');
    const futureDate = moment().add(4, 'day').format('DD-MM-YYYY');

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/jobs',
      payload: {
        description: 'description',
        skills: 'skills',
        minBudget: 100,
        maxBudget: 200,
        expiredAt: futureDate,
        userId: 'uuid',
      },
    });

    expect(res.statusCode).toEqual(400);
  });

  it('should return 400 when expire date is not future date', async () => {
    createJob.mockImplementation(() => 'uuid');

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/jobs',
      payload: {
        title: 'title',
        description: 'description',
        skills: 'skills',
        minBudget: 100,
        maxBudget: 200,
        expiredAt: '2000-10-10',
        userId: 'uuid',
      },
    });

    expect(res.statusCode).toEqual(400);
  });

  it('should return 200 when limit and offset present', async () => {
    getJobs.mockImplementation(() => [{ title: 'title' }]);
    const token = app.jwt.sign({ foo: 'bar' });
    const res = await app.inject({
      method: 'GET',
      url: 'api/v1/jobs?limit=1&offset=0',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.statusCode).toEqual(200);
  });

  it('should return 200 when limit and offset is not present', async () => {
    getJobs.mockImplementation(() => [{ title: 'title' }]);

    const res = await app.inject({
      method: 'GET',
      url: 'api/v1/jobs',
    });

    expect(res.statusCode).toEqual(400);
  });
});
