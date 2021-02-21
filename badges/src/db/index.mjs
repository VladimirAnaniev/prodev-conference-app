import pg from 'pg';

const pool = new pg.Pool();

export function createEvent(eventId, accountId) {
    return pool.query(`
        INSERT INTO events (id, account_id)
        VALUES ($1, $2)
    `, [eventId, accountId]);
}

export async function existsEvent(eventId, accountId) {
    const events = await pool.query(`
        SELECT 1
        FROM events
        WHERE id = $1
        AND account_id = $2
  `, [eventId, accountId]);
  return events.length !== 0;
}

export function createAttendeeBadge(email, name, companyName, eventId) {
    return pool.query(`
        INSERT INTO badges (email, name, company_name, role, event_id)
        VALUES ($1, $2, $3, '', $4)
        ON CONFLICT DO NOTHING
  `, [email, name, companyName, eventId]);
}

export function createSpeakerBadge(email, name, companyName, eventId) {
    return pool.query(`
        INSERT INTO badges (email, name, company_name, role, event_id)
        VALUES ($1, $2, $3, 'SPEAKER', $4)
        ON CONFLICT (email, event_id)
        DO
        UPDATE SET role = 'SPEAKER'
  `, [email, name, companyName, eventId]);
}

export function getBadges(accountId, eventId) {
    return pool.query(`
    SELECT b.id, b.email, b.name, b.company_name AS "companyName", b.role
    FROM badges b
    JOIN events e ON (b.event_id = e.id)
    WHERE e.account_id = $1
    AND e.id = $2
  `, [accountId, eventId])
}