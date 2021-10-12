import {Context} from '@loopback/context';
import {Server} from '@loopback/core';
import {Channel, connect, Connection, Replies} from 'amqplib';

export class RabbitmqServer extends Context implements Server {
  private _listening: boolean;
  conn: Connection;

  async start(): Promise<void> {
    this.conn = await connect({
      hostname: 'rabbitmq',
      username: 'admin',
      password: 'admin',
    });

    this._listening = true;
    this.boot();
  }

  async boot(): Promise<void> {
    const channel: Channel = await this.conn.createChannel();
    const queue: Replies.AssertQueue = await channel.assertQueue('first-queue');

    channel.sendToQueue('first-queue', Buffer.from('Hello my queue'));
  }

  async stop(): Promise<void> {
    await this.conn.close();

    this._listening = false;
  }

  get listening(): boolean {
    return this._listening;
  }
}
