import fastify from 'fastify';
import { ListingDto } from '../listing/listing.model';
import * as ListingService from '../listing/listing.service';
import { ErrInvalidArgument } from '../errors/errors';
interface Querystring {
  path: string;
  offset: number;
  limit: number;
}

interface Reply {
  200: ListingDto;
  '4xx': { error: string };
  '5xx': { error: string };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const serverSetup = () => {
  const server = fastify();

  // GET: /listing?path={string}&[offset={number}]&[limit={number}]
  server.get<{
    Querystring: Querystring;
    Reply: Reply;
  }>('/listing', async (request, reply) => {
    const { path, offset = 0, limit = 10000 } = request.query;
    try {
      const entries = await ListingService.getFiles(path, offset, limit);
      const dto: ListingDto = {
        entries,
      };
      reply.code(200).send(dto);
    } catch (err) {
      if (err instanceof ErrInvalidArgument) {
        return reply.code(400).send({ error: err.message });
      }

      reply.code(500).send({ error: `${err}` });
    }
  });

  //
  return server;
};
