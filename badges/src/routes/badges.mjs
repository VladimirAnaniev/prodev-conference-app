import { authorize } from '../security.mjs';
import { pool } from '../db/index.mjs';
import qrcode from 'qrcode';
import Router from '@koa/router';

export const router = new Router({
  prefix: '/events/:eventId/badges',
});

router.use(authorize);

router.post('/', async ctx => {
  const { eventId } = ctx.params;
  let eventIdValidator = await ctx.validator(ctx.params, {
    eventId: 'required|integer',
  });
  if (await eventIdValidator.fails()) {
    ctx.status = 400;
    return ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not find that event.',
      errors: v.errors,
    };
  }

  let requestBodyValidator = await ctx.validator(ctx.request.body, {
    presenterName: 'required|minLength:1|maxLength:100',
    email: 'required|email|maxLength:100',
    companyName: 'required|minLength:1|maxLength:100',
    role: 'required|minLength:1|maxLength:100',
    accountId: 'required|integer',
  });
  if (await requestBodyValidator.fails()) {
    ctx.status = 400;
    return ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not create a Badge because at least one of the values is bad.',
      errors: v.errors,
    };
  }

  const { events } = await pool.query(`
    SELECT 1
    FROM events
    WHERE id = $1
  `, [eventId]);
  if (events.length === 0) {
    // TODO: throw error if does not exist.
    await pool.query(`
      INSERT INTO events (id, account_id)
      VALUES ($1, $2)
    `, [eventId, accountId]);
  }

  const {email, presenterName, companyName, role} = ctx.request.body;
  // TODO: on conflict do nothing if role is empty, probably create 2 separate endpoints
  await pool.query(`
    INSERT INTO badges (email, name, company_name, role, event_id)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (email, event_id)
    DO
    UPDATE SET role = $4
  `, [email, presenterName, companyName, role, eventId]);
});

router.get('/', async ctx => {
  const { eventId } = ctx.params;
  let v = await ctx.validator(ctx.params, {
    eventId: 'required|integer',
  });
  let fails = await v.fails();
  if (fails) {
    ctx.status = 400;
    return ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not find that event.',
      errors: v.errors,
    };
  }

  const { rows } = await pool.query(`
    SELECT b.id, b.email, b.name, b.company_name AS "companyName", b.role
    FROM badges b
    JOIN events e ON (b.event_id = e.id)
    WHERE e.account_id = $1
    AND e.id = $2
  `, [ctx.claims.id, eventId])
  ctx.body = rows.map(x => ({
    name: x.name,
    companyName: x.companyName,
    role: x.role,
  }));
  for (let item of ctx.body) {
    item.qrcode = await qrcode.toString(`${item.id}|${item.name}`);
  }
});
