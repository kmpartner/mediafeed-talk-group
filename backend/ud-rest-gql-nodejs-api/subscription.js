// const express = require('express');
// const { createServer } = require('http');
// const { SubscriptionServer } = require('subscriptions-transport-ws');
// const { execute, subscribe } = require('graphql');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

// const graphqlSchema = require('./graphql/schema');

// const PORT = 8085;
// const server = express();

// server.use('*', cors({ origin: `http://localhost:${PORT}` }));

// server.use('/graphql', bodyParser.json(), graphqlExpress({
//   schema
// }));
// server.use('/graphiql', graphiqlExpress({
//   endpointURL: '/graphql',
//   subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
// }));

// // Create WebSocket listener server
// // const websocketServer = createServer((request, response) => {
// //   response.writeHead(404);
// //   response.end();
// // });

// // Wrap the Express server
// const ws = createServer(server);
// ws.listen(PORT, () => {
//   console.log(`Apollo Server is now running on http://localhost:${PORT}`);
//   // Set up the WebSocket for handling GraphQL subscriptions
//   new SubscriptionServer({
//     execute,
//     subscribe,
//     graphqlSchema
//   }, {
//     server: ws,
//     path: '/subscriptions',
//   });
// });

// // // Bind it to port and start listening
// // websocketServer.listen(WS_PORT, () => console.log(
// //   `Websocket Server is now running on http://localhost:${WS_PORT}`
// // ));

// // const subscriptionServer = SubscriptionServer.create(
// //   {
// //     graphqlSchema,
// //     execute,
// //     subscribe,
// //   },
// //   {
// //     server: websocketServer,
// //     path: '/graphql',
// //   },
// // );