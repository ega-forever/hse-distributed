"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorTypes_1 = require("./ErrorTypes");
const CustomError_1 = require("./CustomError");
const apollo_server_errors_1 = require("apollo-server-errors");
function formatError(error) {
    if (error.originalError instanceof apollo_server_errors_1.ApolloError) {
        return new CustomError_1.default(error.message, error.originalError.extensions.code);
    }
    return new CustomError_1.default(error.message, ErrorTypes_1.errorTypes.server);
}
exports.formatError = formatError;
//# sourceMappingURL=ErrorFormatter.js.map