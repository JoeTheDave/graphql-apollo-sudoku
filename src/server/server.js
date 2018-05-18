const Hapi = require('hapi');
const apolloServerHapi = require('apollo-server-hapi');
const graphiqlPlugin = require("hapi-plugin-graphiql")
const { graphqlHapi } = apolloServerHapi;
const schema = require('./schema');

const HOST = 'localhost';
const PORT = 8008;

async function StartServer() {
  const server = new Hapi.server({ host: HOST, port: PORT });

  await server.register({
    plugin: graphqlHapi,
    register: graphiqlPlugin,
    options: {
      path: '/',
      graphqlOptions: { schema },
      route: { cors: true },
    },
  });

  try {
    await server.start();
  } catch (err) {
    console.log(`Error while starting server: ${err.message}`);
  }

  console.log(`Server running at: ${server.info.uri}`);
}

StartServer();
