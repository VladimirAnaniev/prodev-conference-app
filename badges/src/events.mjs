import { createEvent } from './db/index.mjs'

export function handleEvent(event) {
    console.log("Handling event: ", event.content.toString());
    const {id, accountId} = JSON.parse(event.content.toString());
    createEvent(id, accountId);
}
