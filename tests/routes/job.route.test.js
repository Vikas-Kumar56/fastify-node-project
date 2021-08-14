const Fastify = require('fastify');
const moment = require('moment');

const jobRoute = require('../../src/route/job');
const JobService = require('../../src/service/job.service');

jest.mock('../../src/service/job.service');

const getJobs = jest.fn();
const createJob = jest.fn();

// { createJob, getJobs }
JobService.mockImplementation(() => ({ getJobs, createJob }));

let app;
describe('job route', () => {
  beforeAll(async () => {
    app = Fastify();
    app.register(jobRoute, { prefix: 'api/v1/jobs' });

    await app.ready();
  });

  it('should return 201 when job data is valid', async () => {
    createJob.mockImplementation(() => '3023b678-c7fa-44df-a049-7cc80a9ff9e2');
    const futureDate = moment().add(4, 'day').format('YYYY-MM-DD');

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/jobs',
      payload: {
        title: 'title test',
        description: 'description',
        skills: 'skills',
        minBudget: 100,
        maxBudget: 200,
        expiredAt: futureDate,
        userId: 'ddf5326e-ef63-4a48-874b-f6e3944af56d',
      },
    });

    expect(res.statusCode).toEqual(201);
    expect(res.json().jobId).toEqual('3023b678-c7fa-44df-a049-7cc80a9ff9e2');
  });

  it('should return 400 when required fields missing and expired date is not correct format', async () => {
    createJob.mockImplementation(() => '3023b678-c7fa-44df-a049-7cc80a9ff9e2');

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/jobs',
      payload: {
        description: 'description',
        skills: 'skills',
        minBudget: 100,
        maxBudget: 200,
        expiredAt: '12-12-2000',
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 when expire date is not future date', async () => {
    createJob.mockImplementation(() => '3023b678-c7fa-44df-a049-7cc80a9ff9e2');

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/jobs',
      payload: {
        title: 'title',
        description: 'description',
        skills: 'skills',
        minBudget: 100,
        maxBudget: 200,
        expiredAt: '2000-12-12',
        userId: 'ddf5326e-ef63-4a48-874b-f6e3944af56d',
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return jobs when limit and offset present', async () => {
    getJobs.mockImplementation(() => [
      {
        id: 'id',
        title: 'title',
        description: 'description',
      },
    ]);

    const res = await app.inject({
      method: 'GET',
      url: 'api/v1/jobs?limit=1&offset=0',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.json().jobs.length).toEqual(1);
  });

  it('should return 400 when limit and offset not present', async () => {
    getJobs.mockImplementation(() => [
      {
        id: 'id',
        title: 'title',
        description: 'description',
      },
    ]);

    const res = await app.inject({
      method: 'GET',
      url: 'api/v1/jobs',
    });

    expect(res.statusCode).toEqual(400);
  });
});
