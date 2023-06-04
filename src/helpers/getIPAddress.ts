import { Request } from 'express';

export default function getIPAddress(req: Request) {
  let ips = req.headers['x-forwarded-for'];

  if (!Array.isArray(ips)) {
    ips = ips?.split(',');
  }
  return ips?.shift() || req.socket?.remoteAddress;
}
