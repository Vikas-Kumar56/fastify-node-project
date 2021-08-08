const moment = require('moment');
const UserRepository = require('../dao/user.dao');

const userService = (fastify) => {
  const userRepository = UserRepository(fastify.db);

  const getUserById = async (userId) => {
    const user = await userRepository.getUserById(userId);
    const username = [user.first_name, user.middle_name, user.last_name]
      .filter((name) => name !== '')
      .filter((name) => name !== null)
      .filter((name) => name !== undefined)
      .join(' ');
    return {
      id: user.id,
      username,
      email: user.email,
      createdAt: moment(user.created_at).format('DD/MM/YYYY'),
      updatedAt: moment(user.updated_at).format('DD/MM/YYYY'),
      version: user.version,
    };
  };

  // save user in db and return id
  const createUser = async (user) => {
    const userId = await userRepository.saveUser(user);
    return userId;
  };

  return { getUserById, createUser };
};

module.exports = userService;
