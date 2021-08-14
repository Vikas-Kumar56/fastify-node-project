const moment = require('moment');

const jobRepository = (db) => {
  // save job in db
  const save = async (job) => {
    try {
      const { id } = await db.one(
        `
            INSERT INTO jobs(title, description, skills, min_budget, max_budget, expired_at, user_id)
            values($1,$2, $3, $4, $5, $6, $7) RETURNING id
          `,
        [
          job.title,
          job.description,
          job.skills,
          job.minBudget,
          job.maxBudget,
          job.expiredAt,
          job.userId,
        ]
      );

      return id;
    } catch (error) {
      throw Error('Faild to save in db');
    }
  };

  const getAll = async (limit, offset) => {
    try {
      const currentDate = moment().format('YYYY-MM-DD');
      const jobs = await db.query(
        `
            select * from jobs where expired_at >= $1 order by created_at limit $2 offset $3
          `,
        [currentDate, limit, offset]
      );

      return jobs;
    } catch (error) {
      throw Error('failed to fetch job records from db');
    }
  };

  return { save, getAll };
};

module.exports = jobRepository;
