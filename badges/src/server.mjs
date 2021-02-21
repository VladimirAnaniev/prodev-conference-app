import bodyParser from 'koa-body';
import cors from '@koa/cors';
import dotenv from 'dotenv';
import Koa from 'koa';
import niv from 'node-input-validator';
import { router } from './routes/index.mjs';
import { bearer, authorize } from './security.mjs';
import { eventsQueue } from './queue/events.mjs';
import { handleEvent } from './events.mjs'

dotenv.config();

const port = Number.parseInt(process.env['PORT']);
if (Number.isNaN(port)) {
  console.error('ERROR: Missing PORT environment variable.');
  process.exit(1);
}

const app = new Koa();
app.use(cors({
  allowHeaders: ['Authorization', 'Content-Type']
}));

app.use(niv.koa());
app.use(bearer);
app.use(authorize);

app.use(bodyParser({ multipart: true }));

app.use(router.routes());

app.listen(port, () => {
  eventsQueue.subscribe(handleEvent);
  console.log(`Accepting connections on ${port}`)
});
