"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUserId = exports.authJwt = void 0;
const jwt = require('jsonwebtoken');
require('dotenv').config();
exports.authJwt = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY);
    }
    catch (err) {
        return false;
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        return false;
    }
    // console.log('decodedToken', decodedToken);
    return true;
});
exports.authUserId = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY);
    }
    catch (err) {
        console.log(err);
        return null;
        // err.statusCode = 500;
        // throw err;
    }
    if (!decodedToken) {
        return null;
    }
    // console.log('decodedToken', decodedToken);
    return decodedToken.userId;
});
