import * as grpc from 'grpc';

export default interface IGRPCResolver {
  register(server: grpc.Server): void;
}