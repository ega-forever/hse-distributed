"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const loader = (relativePath) => {
    return protoLoader.loadSync(path.join(__dirname, relativePath), {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
};
exports.definitions = {
    services: {
        auth: {
            tokenValidation: loader.bind(null, '../../src/grpc/services/auth/proto/token_validation.proto')
        }
    }
};
//# sourceMappingURL=index.js.map