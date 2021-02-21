import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const queueHost = process.env['AMQP_HOST'];
const eventsQueueName = process.env['EVENTS_QUEUE'];

class EventsQueue {
    connection = null;
    channel = null;

    async publishEvent(event) {
        console.log("Publishing event: ", event);
        const channel = await this.getChannel();
        await channel.assertQueue(eventsQueueName, {durable: false});
        return channel.sendToQueue(eventsQueueName, Buffer.from(JSON.stringify(event)));
    }

    async getChannel() {
        if (!this.channel) {
            const connection = await this.getConnection();
            this.channel = await connection.createChannel();
        }
        return this.channel;
    }

    async getConnection() {
        if (!this.connection) {
            this.connection = await amqp.connect(queueHost);
        }
        return this.connection;
    }

    close() {
        if (this.channel) {
            this.channel.close();
            this.channel = null;
        }
        if (this.connection) {
            this.connection.close();
            this.connection = null;
        }
    }
}

export const eventsQueue = new EventsQueue();
