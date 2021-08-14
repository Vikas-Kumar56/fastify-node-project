const JobService = require('../../src/service/job.service');
const JobRepository = require('../../src/dao/job.dao');

jest.mock('../../src/dao/job.dao');

const save = jest.fn();
const getAll = jest.fn();

describe('Job Service', () => {
  beforeAll(() => {
    JobRepository.mockImplementation(() => ({
      save,
      getAll,
    }));
  });

  it('should return jobId when job is valid', async () => {
    save.mockImplementation(() => 'uuid');

    const { createJob } = JobService({});

    const jobId = await createJob({
      title: 'title',
    });

    expect(jobId).toEqual('uuid');
  });

  it('should return jobs when getJobs called', async () => {
    getAll.mockImplementation(() => [
      {
        title: 'title',
        created_at: '2021-08-07 13:46:33.934071+00',
        updated_at: '2021-08-07 13:46:33.934071+00',
      },
    ]);

    const { getJobs } = JobService({});

    const jobs = await getJobs(1, 0);

    expect(jobs.length).toEqual(1);
    expect(jobs[0].createdAt).toEqual('07/08/2021');
    expect(jobs[0].updatedAt).toEqual('07/08/2021');
  });
});
