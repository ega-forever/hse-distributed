"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = require("grpc");
const authTokenTypes_1 = require("../constants/authTokenTypes");
const grpc_1 = require("../../../grpc");
const Error_1 = require("../../../errors/Error");
const ErrorTypes_1 = require("../../../errors/ErrorTypes");
class AuthService {
    constructor(uri) {
        const { token_validation: tokenValidationProto } = grpc.loadPackageDefinition(grpc_1.definitions.services.auth.tokenValidation());
        // @ts-ignore
        this.client = new tokenValidationProto.TokenValidation(uri, grpc.credentials.createInsecure());
    }
    async createAuthChecker({ context }, roles) {
        const isAnyRoleExist = roles.find(role => authTokenTypes_1.tokenTypes[role]);
        if (!isAnyRoleExist) {
            throw new Error_1.Error(null, ErrorTypes_1.errorTypes.auth.forbidden);
        }
        const tokenTypeMap = {
            [authTokenTypes_1.tokenTypes.account]: context.authorization_token,
            [authTokenTypes_1.tokenTypes.refresh]: context.refresh_token
        };
        const isAnyTokenSupplied = !!Object.values(tokenTypeMap).find(token => token);
        if (!isAnyTokenSupplied) {
            throw new Error_1.Error(null, ErrorTypes_1.errorTypes.auth.unauthorized);
        }
        const tokensMap = {};
        for (const role of roles) {
            if (!tokenTypeMap[role]) {
                continue;
            }
            tokensMap[role] = await this.validate(role, tokenTypeMap[role]);
        }
        const isAnyValidToken = !!Object.values(tokensMap).find(token => token);
        if (!isAnyValidToken) {
            throw new Error_1.Error(null, ErrorTypes_1.errorTypes.auth.unauthorized);
        }
        context.user = tokensMap[authTokenTypes_1.tokenTypes.account];
        context.refresh = tokensMap[authTokenTypes_1.tokenTypes.refresh];
        return true;
    }
    async validate(type, token) {
        const result = await new Promise((res, rej) => this.client.validate({ type, token }, (err, data) => err ? rej(err) : res(data)));
        if (result.error) {
            throw new Error_1.Error(null, ErrorTypes_1.errorTypes.auth.unauthorized);
        }
        return {
            accountId: parseInt(result.accountId, 10),
            tokenId: parseInt(result.tokenId, 10),
            email: result.email
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map