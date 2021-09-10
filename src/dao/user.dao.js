const userRepository = (db) => {
  // Get user by user id
  const getUserById = async (userId) => {
    try {
      const user = await db.one('select * from users where id = $1', [userId]);
      return user;
    } catch {
      throw Error(`${userId} does not exist`);
    }
  };

  const getUserByEmail = async (email) => {
    try {
      const user = await db.one('select * from users where email = $1', [
        email,
      ]);

      return user;
    } catch {
      throw Error(`${email} does't exist`);
    }
  };

  // save user in db
  const saveUser = async (user) => {
    try {
      const { id } = await db.one(
        'INSERT INTO users(first_name, middle_name, last_name, password, email) VALUES($1, $2, $3, $4, $5) RETURNING id',
        [
          user.firstName,
          user.middleName,
          user.lastName,
          user.password,
          user.email,
        ]
      );
      return id;
    } catch (error) {
      throw Error('Not valid user data - failed to save in db');
    }
  };

  return { getUserById, saveUser, getUserByEmail };
};

module.exports = userRepository;
