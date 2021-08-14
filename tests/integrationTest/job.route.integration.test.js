const moment = require('moment');
const build = require('../../src/app');

let app;

describe('Job route integration', () => {
  beforeAll(() => {
    app = build();
  });

  afterAll(() => {
    app.close();
  });

  it('should return 201 when called with valid data', async () => {
    const futureDate = moment().add(4, 'day').format('YYYY-MM-DD');
    // save user
    const userRes = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        firstName: 'peter',
        password: 'password',
        email: 'email@gmail.com',
      },
    });
    const { userId } = userRes.json();
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
        userId,
      },
    });

    expect(res.statusCode).toEqual(201);
  });

  it('should return 200 when getAll called', async () => {
    const res = await app.inject({
      method: 'GET',
      url: 'api/v1/jobs?limit=1&offset=0',
    });

    expect(res.statusCode).toEqual(200);
  });
});
