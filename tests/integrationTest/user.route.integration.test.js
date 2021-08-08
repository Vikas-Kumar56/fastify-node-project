const build = require('../../src/app');

let app;

describe('user route integration', () => {
  beforeAll(() => {
    app = build();
  });

  afterAll(() => {
    app.close();
  });

  it('should save user when called with valid data', async () => {
    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        firstName: 'peter',
        password: 'password',
        email: 'email@gmail.com',
      },
    });

    expect(res.statusCode).toBe(201);
    expect(res.json().userId).toBeDefined();
  });

  it('should get user when user exist', async () => {
    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        firstName: 'peter',
        password: 'password',
        email: 'email@gmail.com',
      },
    });

    const getRes = await app.inject({
      method: 'GET',
      url: `api/v1/users/${res.json().userId}`,
    });

    expect(getRes.statusCode).toBe(200);
    expect(getRes.json().username).toEqual('peter');
  });
});
