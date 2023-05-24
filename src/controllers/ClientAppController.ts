import { Request, Response } from "express";
import validateSchema from "../validators/validatorSchema";
import {
  ClientAppCreationSchema,
  ClientAppUpdateSchema,
} from "../validators/schemas/ClientAppSchema";
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
        title: `${app.name} - Internet Passport`,
        description: `manage ${app.name}`,
      },
      path: req.path,
      isLoggedIn: !!req.user,
      isDeveloper: req.user && req.user.developer,
      app,
      error,
    });
  }

  async updateApp(req: Request, res: Response) {
    const { id } = req.params;
    try {
      console.log(req.body);
      const data = await validateSchema(ClientAppUpdateSchema, req.body);
      const updated = await this.clientAppService.updateApp(data, id);
      req.flash(
        updated ? "info" : "error",
        updated ? "App updated" : "Failed to update"
      );
      res.redirect(`/client/apps/${id}`);
    } catch (error: any) {
      req.flash("error", error.message);
      res.redirect(`/client/apps/${id}`);
    }
  }

  async deleteApp(req: IRequest, res: Response) {
    const { id } = req.params;
    try {
      await this.clientAppService.deleteApp(
        id,
        req.user?.developer as Developer
      );
      req.flash("info", "App deleted");
      res.redirect(`/developer/dashboard`);
    } catch (error: any) {
      req.flash("error", error.message);
      res.redirect(`/client/apps/${id}`);
    }
  }
}