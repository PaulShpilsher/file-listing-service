import { serverSetup } from './server/server';

const server = serverSetup();

const port = 3000;

server
  .listen({ port })
  .then((x) => console.log(`listening on ${port} | ${x}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
