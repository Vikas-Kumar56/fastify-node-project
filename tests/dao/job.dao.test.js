const Fastify = require('fastify');
const moment = require('moment');
const dbPlugin = require('../../src/plugin/database');
const JobRepository = require('../../src/dao/job.dao');
const UserRepository = require('../../src/dao/user.dao');

let app;
let userId;
describe('Jobs Repository', () => {
  const getUserId = async () => {
    const user = {
      firstName: 'peter',
      lastName: 'smith',
      password: 'password',
      email: 'email',
    };

    const { saveUser } = UserRepository(app.db);

    const id = await saveUser(user);

    return id;
  };

  beforeAll(async () => {
    app = Fastify();
    app.register(dbPlugin);

    await app.ready();
    userId = await getUserId();
  });

  afterEach(async () => {
    await app.db.query('delete from jobs');
  });

  it('should save job data in database', async () => {
    const { save } = JobRepository(app.db);

    const jobId = await save({
      title: 'test title',
      description: 'description',
      skills: 'skills',
      minBudget: 100,
      maxBudget: 200,
      expiredAt: '2022/09/21',
      userId,
    });

    expect(jobId).toBeDefined();
  });

  it('should throw error when title and userId not present', async () => {
    const { save } = JobRepository(app.db);

    await expect(
      save({
        description: 'description',
        skills: 'skills',
        minBudget: 100,
        maxBudget: 200,
        expiredAt: '2022/09/21',
        userId: null,
      })
    ).rejects.toThrow(Error('Failed to save in db'));
  });

  it('should return jobs data', async () => {
    const futureDate = moment().add(4, 'day').format('YYYY-MM-DD');

    const { save, getAll } = JobRepository(app.db);

    await save({
      title: 'test title - 1',
      description: 'description',
      skills: 'skills',
      minBudget: 100,
      maxBudget: 200,
      expiredAt: futureDate,
      userId,
    });

    await save({
      title: 'test title - second',
      description: 'description',
      skills: 'skills',
      minBudget: 100,
      maxBudget: 200,
      expiredAt: futureDate,
      userId,
    });

    const jobs = await getAll(1, 0);

    expect(jobs.length).toEqual(1);
    expect(jobs[0].title).toEqual('test title - 1');

    const nextJobs = await getAll(1, 1);

    expect(nextJobs.length).toEqual(1);
    expect(nextJobs[0].title).toEqual('test title - second');
  });

  it('should filter expired jobs', async () => {
    const futureDate = moment().add(4, 'day').format('YYYY-MM-DD');

    const { save, getAll } = JobRepository(app.db);

    await save({
      title: 'test title - 1',
      description: 'description',
      skills: 'skills',
      minBudget: 100,
      maxBudget: 200,
      expiredAt: futureDate,
      userId,
    });

    await save({
      title: 'test title - second',
      description: 'description',
      skills: 'skills',
      minBudget: 100,
      maxBudget: 200,
      expiredAt: '2000-10-21',
      userId,
    });

    const jobs = await getAll(2, 0);

    expect(jobs.length).toEqual(1);
    expect(jobs[0].title).toEqual('test title - 1');
  });
});
