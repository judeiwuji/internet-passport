import { Request, Response } from "express";
import validateSchema from "../validators/validatorSchema";
import { ClientAppCreationSchema } from "../validators/schemas/ClientAppSchema";
import ClientAppService from "../services/ClientAppService";
import IRequest from "../models/interfaces/IRequest";
import Developer from "../models/Developer";
import ClientApp from "../models/ClientApp";

export default class ClientAppController {
  private clientAppService = new ClientAppService();
  async createApp(req: IRequest, res: Response) {
    try {
      const data = await validateSchema(ClientAppCreationSchema, req.body);
      const app = await this.clientAppService.createApp(
        data,
        req.user?.developer as Developer
      );
      req.flash("info", "App created");
      res.redirect(`/client/apps/${app.id}`);
    } catch (error: any) {
      req.flash("error", error.message);
      res.redirect("/developer/dashboard?tab=createApp");
    }
  }

  async getApps(req: IRequest, res: Response) {
    const { page } = req.query;

    const apps = await this.clientAppService.getApps(
      Number(page),
      req.user?.developer as Developer
    );
  }

  async getApp(req: IRequest, res: Response) {
    const { id } = req.params;
    let app: any | null = null;
    let error: any;

    try {
      app = (await this.clientAppService.findAppBy({ id })).toJSON();
    } catch (err: any) {
      error = err;
    }

    res.render("developer/applicationDetails", {
      page: {
        title: "Applications - Internet Passport",
        description: "manage application",
      },
      path: req.path,
      isLoggedIn: !!req.user,
      isDeveloper: req.user && req.user.developer,
      app,
      error,
    });
  }

  async updateApp(req: Request, res: Response) {}

  async deleteApp(req: Request, res: Response) {}
}
