const postRequestbody = {
  type: 'object',
  required: ['title'],
  properties: {
    title: {
      type: 'string',
      minLength: 10,
    },
  },
};

const getResponseBody = {
  200: {
    type: 'object',
    required: ['temps'],
    properties: {
      temps: {
        type: 'array',
        items: {
          type: 'object',
          required: ['title', 'id'],
          properties: {
            id: {
              type: 'string',
            },
            title: {
              type: 'string',
              minLength: 10,
            },
          },
        },
      },
    },
  },
};

const postReponse = {
  201: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
};

module.exports = {
  postRequestbody,
  postReponse,
  getResponseBody,
};
