import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

const loader = (relativePath) => {
  return protoLoader.loadSync(
    path.join(__dirname, relativePath),
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });
};

export const definitions = {
  services: {
    auth: {
      tokenValidation: loader.bind(null, '../../src/grpc/services/auth/proto/token_validation.proto')
    }
  }
};

