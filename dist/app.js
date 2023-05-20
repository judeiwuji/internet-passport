import express from "express";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
dotenv.config();
class App {
    constructor() {
        this.app = express();
        this.port = Number(process.env.PORT);
        this.settings();
    }
    settings() {
        console.log(process.argv[1]);
        console.log(fileURLToPath(import.meta.url));
        this.app.listen(this.port, () => console.log(`Server is running on PORT ::${this.port}`));
    }
}
function run() {
    const app = new App();
}
run();
//# sourceMappingURL=app.js.map