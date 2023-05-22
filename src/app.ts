import path from "path";
import express, { Application, Request, Response } from "express";
import { engine } from "express-handlebars";
import morgan from "morgan";
import * as dotenv from "dotenv";
import RouteManager from "./routes/RouteManager";
import DB from "./models/engine/DBStorage";
import userAgent from "express-useragent";
import methodOverride from "method-override";
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
          equals: function (a: any, b: any) {
            return a === b;
          },
        },
      })
    );
    this.app.set("view engine", "hbs");
    this.app.set("views", path.join(__dirname, "../views"));
    this.app.use(express.static(path.join(__dirname, "..", "public")));
    this.app.use(express.json({}));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan("dev"));
    this.app.use(userAgent.express());
    this.app.use(
      methodOverride((req: Request, res: Response) => {
        if (req.body && typeof req.body === "object" && "_method" in req.body) {
          // look in urlencoded POST bodies and delete it
          var method = req.body._method;
          delete req.body._method;
          return method;
        }
      })
    );
  }

  settings() {
    DB.sync({ alter: false }).catch((err) => {
      console.log(err.message);
    });
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
