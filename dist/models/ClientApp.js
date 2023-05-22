"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Developer_1 = __importDefault(require("./Developer"));
const crypto_1 = __importDefault(require("crypto"));
const sequelize_1 = require("sequelize");
let ClientApp = class ClientApp extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.IsUUID)(4),
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_1.DataTypes.UUIDV4 }),
    __metadata("design:type", String)
], ClientApp.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Developer_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ClientApp.prototype, "developerId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Developer_1.default),
    __metadata("design:type", Developer_1.default)
], ClientApp.prototype, "developer", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(150)),
    __metadata("design:type", String)
], ClientApp.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(300)),
    __metadata("design:type", String)
], ClientApp.prototype, "redirectURL", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(36),
        defaultValue: crypto_1.default.randomBytes(16).toString("hex"),
    }),
    __metadata("design:type", String)
], ClientApp.prototype, "secret", void 0);
ClientApp = __decorate([
    sequelize_typescript_1.Table
], ClientApp);
exports.default = ClientApp;
//# sourceMappingURL=ClientApp.js.map