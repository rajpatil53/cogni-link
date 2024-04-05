import { serveEncodedDefinition } from "@composedb/devtools-node";
import fsPromises from 'fs/promises';
import path from 'path';

const composeDbConfigFilePath = path.join(process.cwd(), 'composedb.config.json');
const composeDbConfigJSON = await fsPromises.readFile(composeDbConfigFilePath);
const composeDbConfig = JSON.parse(composeDbConfigJSON);

console.log('DID: ', composeDbConfig["http-api"]["admin-dids"][0])
/**
 * Runs GraphiQL server to view & query composites.
 */
const server = await serveEncodedDefinition({
  ceramicURL: "http://localhost:7007",
  graphiql: true,
  path: "./__generated__/definition.json",
  port: 5001,
  did: composeDbConfig["http-api"]["admin-dids"][0]
});

console.log(`Server started on http://localhost:${server.port}/graphql`);

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server stopped");
  });
});
