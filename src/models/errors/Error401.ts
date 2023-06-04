import BaseError from './BaseError';

export default class Error401 extends BaseError {
  constructor(message: string) {
    super('E401', message);
  }
}
