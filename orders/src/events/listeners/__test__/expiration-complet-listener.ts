import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderStatus, ExpirationCompleteEvent } from '@fldevtickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/orders';
import {ExpirationCompleteListener} from '../expiration-complete-listener'

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  })
  await ticket.save()
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'dfsds',
    expiresAt: new Date(),
    ticket
  })
  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }
    // @ts-ignore
  const msg: Message = {

    ack: jest.fn()
  }
  return { listener, order, ticket, data, msg }
};


it('it updates the order status to cancelled', async () => {
  const { listener, data, msg, order } = await setup();
  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
});

it('emit an OrderCancelled event', async () => {
    const { listener, data, msg, order } = await setup();
  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
  expect(eventData.id).toEqual(order.id)
});

it('ack the message', async () => {
    const { listener, data, msg } = await setup();
  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled()

});
