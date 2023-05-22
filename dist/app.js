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
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const express_handlebars_1 = require("express-handlebars");
const morgan_1 = __importDefault(require("morgan"));
const dotenv = __importStar(require("dotenv"));
const RouteManager_1 = __importDefault(require("./routes/RouteManager"));
const DBStorage_1 = __importDefault(require("./models/engine/DBStorage"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const method_override_1 = __importDefault(require("method-override"));
dotenv.config();
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = Number(process.env.PORT);
        this.middlewares();
        this.settings();
    }
    middlewares() {
        this.app.engine("hbs", (0, express_handlebars_1.engine)({
            extname: "hbs",
            helpers: {
                equals: function (a, b) {
                    return a === b;
                },
            },
        }));
        this.app.set("view engine", "hbs");
        this.app.set("views", path_1.default.join(__dirname, "../views"));
        this.app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
        this.app.use(express_1.default.json({}));
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use(express_useragent_1.default.express());
        this.app.use((0, method_override_1.default)((req, res) => {
            if (req.body && typeof req.body === "object" && "_method" in req.body) {
                // look in urlencoded POST bodies and delete it
                var method = req.body._method;
                delete req.body._method;
                return method;
            }
        }));
    }
    settings() {
        DBStorage_1.default.sync({ alter: false }).catch((err) => {
            console.log(err.message);
        });
        new RouteManager_1.default(this.app);
        this.app.listen(this.port, () => console.log(`Server is running on PORT ::${this.port}`));
    }
}
function run() {
    const app = new App();
}
if (require.main === module) {
    run();
}
//# sourceMappingURL=app.js.map