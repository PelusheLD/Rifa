const serverlessExpress = require('@vendia/serverless-express');
const app = require('../dist/server/server/index.js').default;

exports.handler = serverlessExpress({ app }); 