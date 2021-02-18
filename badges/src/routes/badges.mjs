import qrcode from 'qrcode';
import Router from '@koa/router';
import { validateCreateBadgeRequest, validateGetBadgesRequest } from '../validations.mjs';
import { createAttendeeBadge, createSpeakerBadge } from '../db/index.mjs';
import { getBadges } from '../db/index.mjs';

export const router = new Router({
  prefix: '/events/:eventId',
});

router.post('/attendee', validateCreateBadgeRequest, async ctx => {
  const {eventId} = ctx.params;
  const {email, name, companyName} = ctx.request.body;
  await createAttendeeBadge(email, name, companyName, eventId);
});

router.post('/presenter', validateCreateBadgeRequest, async ctx => {
  const {eventId} = ctx.params;
  const {email, name, companyName} = ctx.request.body;
  await createSpeakerBadge(email, name, companyName, eventId);
});

router.get('/', validateGetBadgesRequest, async ctx => {
  const { rows } = await getBadges(ctx.claims.id, eventId)
  ctx.body = rows.map(x => ({
    name: x.name,
    companyName: x.companyName,
    role: x.role,
  }));
  for (let item of ctx.body) {
    item.qrcode = await qrcode.toString(`${item.id}|${item.name}`);
  }
});
