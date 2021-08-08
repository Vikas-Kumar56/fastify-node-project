const jobRepository = (db) => {
  const save = async (job) => {
    try {
      const { id } = await await db.one(
        `INSERT INTO jobs(title, description, skills, min_budget, max_budget, expired_at, user_id) 
                  VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
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
      throw Error('Failed to save in db');
    }
  };

  const getAll = async (limit, offset) => {
    try {
      const jobs = await db.query(
        `
          select * from jobs order by created_at limit $1 offset $2
        `,
        [limit, offset]
      );

      return jobs;
    } catch (error) {
      throw Error('Failed to fetch records from db');
    }
  };

  return { save, getAll };
};

module.exports = jobRepository;
