import Router from '@koa/router';
import { router as badgesRouter } from './badgesmjs';

export const router = new Router();

router.use('/api', badgesRouter.routes(), badgesRouter.allowedMethods());
