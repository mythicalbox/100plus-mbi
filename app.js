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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_cors_1 = __importDefault(require("fastify-cors"));
const typebox_1 = require("@sinclair/typebox");
const fastify = fastify_1.default({
    logger: true
});
const PORT = process.env.PORT || 5000;
fastify.register(fastify_cors_1.default, {});
fastify.get('/', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    reply.type('application/json').code(200);
    return {
    // mbi: generateMBI(),
    // valid_mbi: valid_mbi
    };
}));
fastify.listen(PORT, (err, address) => {
    if (err)
        throw err;
    // Server is now listening on ${address}
});
function getMBIFormat() {
    let numeric_c = "123456789";
    let numeric_n = "0123456789";
    let alphabetic = "ACDEFGHJKMNPQRTUVWXY";
    let mbi_format = [
        numeric_c,
        alphabetic,
        alphabetic + numeric_n,
        numeric_n,
        alphabetic,
        alphabetic + numeric_n,
        numeric_n,
        alphabetic,
        alphabetic,
        numeric_n,
        numeric_n // pos 11
    ];
    mbi_format;
    return mbi_format;
}
function generateMBI() {
    let mbi_format = getMBIFormat();
    let new_mbi = "";
    for (var i = 0; i < mbi_format.length; i++) {
        let format_for_position = mbi_format[i];
        new_mbi += format_for_position[randomIntFromInterval(0, format_for_position.length - 1)];
    }
    new_mbi = insertIntoString(new_mbi, 4, "-");
    new_mbi = insertIntoString(new_mbi, 8, "-");
    return new_mbi;
}
fastify.get('/generate', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return { mbi: generateMBI() };
}));
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function insertIntoString(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}
const ivalidate_post = typebox_1.Type.Object({
    mbi: typebox_1.Type.String()
});
fastify.post('/validate', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    let mbi = request.body.mbi;
    // console.log(request.body);
    if (mbi == null || mbi == "")
        return { valid: false, reason: "No input." };
    mbi = mbi.replace(/-/g, "");
    if (mbi.length != 11)
        return { valid: false, reason: "Invalid length." };
    let mbi_format = getMBIFormat();
    for (var i = 0; i < 11; i++) {
        // console.log(mbi[i]);
        if (mbi_format[i].indexOf(mbi[i]) == -1) {
            return { valid: false, reason: "Character at position " + (i + 1) + " is invalid. (not counting dashes)" };
        }
    }
    return { valid: true };
}));
