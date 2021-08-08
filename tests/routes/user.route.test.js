const Fastify = require('fastify');
const userRoute = require('../../src/route/user');
const UserService = require('../../src/service/user.service');

jest.mock('../../src/service/user.service');

const createUser = jest.fn();
const getUserById = jest.fn();

UserService.mockImplementation(() => ({
  getUserById,
  createUser,
}));

let app;

describe('user route', () => {
  beforeAll(async () => {
    app = Fastify();
    app.register(userRoute, { prefix: 'api/v1/users' });

    await app.ready();
  });

  it('should return 201 when called with valid usert data', async () => {
    createUser.mockImplementation(() => 'uuid');

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
    expect(res.json().userId).toEqual('uuid');
  });

  it('should return 400 when user service throw error', async () => {
    createUser.mockImplementation(() => {
      throw Error('invalid data');
    });

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        firstName: 'peter',
        password: 'password',
        email: 'email@gmail.com',
      },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json().message).toEqual('invalid data');
  });

  it('should return 400 when email is not in correct format', async () => {
    createUser.mockImplementation(() => 'uuid');

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        firstName: 'peter',
        password: 'password',
        email: 'email',
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 when password and firstName is not present', async () => {
    createUser.mockImplementation(() => 'uuid');

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        email: 'email@gmail.com',
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 200 when user exist', async () => {
    getUserById.mockImplementation(() => ({
      id: '31d3c205-c9d3-4d8b-8fe2-0f21888d98a4',
      username: 'peter',
      email: 'email@gmail.com',
      createdAt: '08/09/2020',
      updatedAt: '08/09/2021',
      version: '11668866-d786-4171-9792-9ee7972c9335',
    }));

    const res = await app.inject({
      method: 'GET',
      url: 'api/v1/users/31d3c205-c9d3-4d8b-8fe2-0f21888d98a4',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      id: '31d3c205-c9d3-4d8b-8fe2-0f21888d98a4',
      username: 'peter',
      email: 'email@gmail.com',
      createdAt: '08/09/2020',
      updatedAt: '08/09/2021',
      version: '11668866-d786-4171-9792-9ee7972c9335',
    });
  });

  it('should return 400 when userid is not valid uuid', async () => {
    getUserById.mockImplementation(() => ({
      id: '31d3c205-c9d3-4d8b-8fe2-0f21888d98a4',
      username: 'peter',
      email: 'email@gmail.com',
      createdAt: '08/09/2020',
      updatedAt: '08/09/2021',
      version: '11668866-d786-4171-9792-9ee7972c9335',
    }));

    const res = await app.inject({
      method: 'GET',
      url: 'api/v1/users/some-invalid-uuid',
    });

    expect(res.statusCode).toBe(400);
  });
});
