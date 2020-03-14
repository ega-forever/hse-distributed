export default async (amqp, req) => {
  req.amqp = amqp;
  req.next();
}