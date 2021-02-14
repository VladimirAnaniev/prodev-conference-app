import { pool } from '../db/index.mjs';
import Router from '@koa/router';
import bcrypt from 'bcryptjs';
import { signToken } from '../security.mjs';

export const router = new Router({
  prefix: '/session',
});

router.put('new_session', '/', async ctx => {
  let { email, password } = ctx.request.body;
  email = email.toLowerCase().trim();
  password = password.trim();
  const { rows } = await pool.query(`
    SELECT id, name, hashed_password
    FROM accounts
    WHERE email = $1`,
    [email]
  );
  
  if (await shouldAuthenticate(password, rows)) {
    const token = signToken({ id: rows[0].id, name: rows[0].name, email });
    ctx.status = 201;
    ctx.body = { token };
  } else {
    ctx.status = 404;
    ctx.body = {
      code: 'BAD_CREDENTIALS',
      message: 'Could not authenticate with those credentials'
    };
  }
});

const shouldAuthenticate = async (password, rows) => {
  if (rows.length !== 0) {
    const hash = rows[0].hashed_password;
    return await bcrypt.compare(password, hash) && rows.length === 1;
  }
  return false;
}
