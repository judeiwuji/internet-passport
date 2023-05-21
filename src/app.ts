import path from "path";
import express, { Application } from "express";
import { engine } from "express-handlebars";
import morgan from "morgan";
import * as dotenv from "dotenv";
import RouteManager from "./routes/RouteManager";
dotenv.config();

class App {
  public app!: Application;
  public port!: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT);
    this.middlewares();
    this.settings();
  }

  middlewares() {
    this.app.engine(
      "hbs",
      engine({
        extname: "hbs",
        helpers: {
          equals: (a: any, b: any) => {
            return a === b;
          },
        },
      })
    );
    this.app.set("view engine", "hbs");
    this.app.set("views", path.join(__dirname, "../views"));
    this.app.use(express.static(path.join(__dirname, "..", "public")));
    this.app.use(morgan("dev"));
  }

  settings() {
    new RouteManager(this.app);
    this.app.listen(this.port, () =>
      console.log(`Server is running on PORT ::${this.port}`)
    );
  }
}

function run() {
  const app = new App();
}

if (require.main === module) {
  run();
}
