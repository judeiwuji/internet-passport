"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const mysql = __importStar(require("mysql2"));
const dotenv = __importStar(require("dotenv"));
const User_1 = __importDefault(require("../User"));
const Developer_1 = __importDefault(require("../Developer"));
const ClientApp_1 = __importDefault(require("../ClientApp"));
const UserApp_1 = __importDefault(require("../UserApp"));
const UserDevice_1 = __importDefault(require("../UserDevice"));
const UserSecret_1 = __importDefault(require("../UserSecret"));
dotenv.config();
const DB = new sequelize_typescript_1.Sequelize({
    database: process.env["DB_NAME"],
    host: process.env["DB_HOST"],
    password: process.env["DB_PASS"],
    username: process.env["DB_USER"],
    dialect: "mysql",
    dialectModule: mysql,
    define: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
        paranoid: true,
        timestamps: true,
    },
    //   logging: false,
    timezone: "+01:00",
    models: [User_1.default, Developer_1.default, ClientApp_1.default, UserApp_1.default, UserDevice_1.default, UserSecret_1.default],
});
exports.default = DB;
//# sourceMappingURL=DBStorage.js.map