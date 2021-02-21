import { existsEvent } from "./db/index.mjs";

export const validateCreateBadgeRequest = async (ctx, next) => {
  console.log("Validating Create Badge request");
  const { eventId } = ctx.params;
  let eventIdValidator = await ctx.validator(ctx.params, {
    eventId: 'required|integer',
  });
  if (await eventIdValidator.fails()) {
    ctx.status = 400;
    console.log(v.errors);
    return ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not find that event.',
      errors: v.errors,
    };
  }

  let requestBodyValidator = await ctx.validator(ctx.request.body, {
    name: 'required|minLength:1|maxLength:100',
    email: 'required|email|maxLength:100',
    companyName: 'required|minLength:1|maxLength:100',
    accountId: 'required|integer',
  });
  if (await requestBodyValidator.fails()) {
    ctx.status = 400;
    console.log(v.errors);
    return ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not create a Badge because at least one of the values is bad.',
      errors: v.errors,
    };
  }
  if (!(await existsEvent(eventId, ctx.claims.id))) {
    ctx.status = 404;
    return ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not find an event with this id.',
    };
  }
  await next();
}

export const validateGetBadgesRequest =  async (ctx, next) => {
  console.log('Validating GET Request');
  let v = await ctx.validator(ctx.params, {
    eventId: 'required|integer',
  });
  let fails = await v.fails();
  if (fails) {
    ctx.status = 400;
    connsole.log(v.errors)
    return ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not find that event.',
      errors: v.errors,
    };
  }
  await next();
}
