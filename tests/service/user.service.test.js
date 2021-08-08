const UserService = require('../../src/service/user.service');
const UserRepository = require('../../src/dao/user.dao');

const getUserByIdDao = jest.fn();
const saveUser = jest.fn();

jest.mock('../../src/dao/user.dao');

describe('user service', () => {
  beforeAll(() => {
    UserRepository.mockImplementation(() => ({
      getUserById: getUserByIdDao,
      saveUser,
    }));
  });
  it('should save user when user data is valid', async () => {
    const { createUser } = UserService({});
    saveUser.mockReturnValueOnce('user_uuid');

    const user = {
      firstName: 'peter',
      lastName: 'smith',
      password: 'password',
      email: 'email',
    };

    const userId = await createUser(user);

    expect(userId).toEqual('user_uuid');
    expect(saveUser).toHaveBeenCalledWith(user);
  });

  it('should retun user when userId exist', async () => {
    const { getUserById } = UserService({});
    getUserByIdDao.mockReturnValueOnce({
      id: 'uuid',
      first_name: 'peter',
      middle_name: 'middlename',
      last_name: 'smith',
      password: 'password',
      email: 'email',
      created_at: '2021-08-07 13:46:33.934071+00',
      updated_at: '2021-08-07 13:46:33.934071+00',
      version: '1',
    });

    const user = await getUserById('user_uuid');

    expect(user).toEqual({
      id: 'uuid',
      username: 'peter middlename smith',
      email: 'email',
      createdAt: '07/08/2021',
      updatedAt: '07/08/2021',
      version: '1',
    });
  });

  it('should retun user with correct username when user exist', async () => {
    const { getUserById } = UserService({});
    getUserByIdDao.mockReturnValueOnce({
      id: 'uuid',
      first_name: 'peter',
      password: 'password',
      email: 'email',
      created_at: '2021-08-07 13:46:33.934071+00',
      updated_at: '2021-08-07 13:46:33.934071+00',
      version: 'some uuid',
    });

    const user = await getUserById('user_uuid');

    expect(user).toEqual({
      id: 'uuid',
      username: 'peter',
      email: 'email',
      createdAt: '07/08/2021',
      updatedAt: '07/08/2021',
      version: 'some uuid',
    });
  });
});
