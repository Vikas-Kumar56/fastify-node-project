const Fastify = require('fastify');
const userRoute = require('../../src/route/user');
const UserService = require('../../src/service/user.service');

jest.mock('../../src/service/user.service');

const createUser = jest.fn();
const getUserById = jest.fn();

UserService.mockImplementation(() => ({
  createUser,
  getUserById,
}));

let app;

describe('User route', () => {
  beforeAll(async () => {
    app = Fastify();
    app.register(userRoute, { prefix: 'api/v1/users' });

    await app.ready();
  });

  it('should return 201 when called with valid user data', async () => {
    createUser.mockReturnValueOnce('uuid');

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/users/',
      payload: {
        firstName: 'peter',
        password: 'password',
        email: 'email@gmail.com',
      },
    });

    expect(res.statusCode).toBe(201);
    expect(res.json().userId).toEqual('uuid');
  });

  it('should return 400 when user service throw and error', async () => {
    createUser.mockImplementation(() => {
      throw Error('error');
    });

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/users/',
      payload: {
        firstName: 'peter',
        password: 'password',
        email: 'email@gmail.com',
      },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().message).toEqual('error');
  });

  it('should return 400 when required field is not present', async () => {
    createUser.mockReturnValueOnce('uuid');

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/users/',
      payload: {
        firstName: 'peter',
        password: 'password',
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 when email is not valid', async () => {
    createUser.mockReturnValueOnce('uuid');

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/users/',
      payload: {
        firstName: 'peter',
        password: 'password',
        email: 'email',
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return user data when userID exist', async () => {
    getUserById.mockImplementation(() => ({
      id: 'fff22b42-23a4-4d95-af5a-d4735909baf2',
      username: 'peter',
      email: 'email@gmail.com',
      createdAt: '01/01/2001',
      updatedAt: '02/02/2001',
      version: '1',
    }));

    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/users/fff22b42-23a4-4d95-af5a-d4735909baf2',
    });

    expect(res.json()).toEqual({
      id: 'fff22b42-23a4-4d95-af5a-d4735909baf2',
      username: 'peter',
      email: 'email@gmail.com',
      createdAt: '01/01/2001',
      updatedAt: '02/02/2001',
      version: '1',
    });
  });

  it('should throw error when params is not valid uuid', async () => {
    getUserById.mockImplementation(() => ({
      id: 'fff22b42-23a4-4d95-af5a-d4735909baf2',
      username: 'peter',
      email: 'email@gmail.com',
      createdAt: '01/01/2001',
      updatedAt: '02/02/2001',
      version: '1',
    }));

    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/users/some-invalid-uuid',
    });

    expect(res.statusCode).toEqual(400);
  });
});
