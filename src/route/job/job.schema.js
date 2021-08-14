const postRequestBody = {
  type: 'object',
  required: [
    'title',
    'description',
    'skills',
    'minBudget',
    'maxBudget',
    'expiredAt',
    'userId',
  ],
  properties: {
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    skills: {
      type: 'string',
    },
    minBudget: {
      type: 'number',
    },
    maxBudget: {
      type: 'number',
    },
    expiredAt: {
      type: 'string',
      format: 'date',
    },
    userId: {
      type: 'string',
      format: 'uuid',
    },
  },
};

const queryParameter = {
  type: 'object',
  required: ['limit', 'offset'],
  properties: {
    limit: {
      type: 'number',
    },
    offset: {
      type: 'number',
    },
  },
};

module.exports = {
  postRequestBody,
  queryParameter,
};
