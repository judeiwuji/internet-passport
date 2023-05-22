"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeveloperController {
    getDashboard(req, res) {
        res.render("developer/dashboard", {
            page: {
                title: "Dashboard - Internet Passport",
                description: "Manage your applications",
            },
            path: req.path,
        });
    }
    getProfile(req, res) {
        res.render("developer/profile", {
            page: {
                title: "Profile - Internet Passport",
                description: "Edit your account profile",
            },
            path: req.path,
        });
    }
    getApplicationDetails(req, res) {
        res.render("developer/applicationDetails", {
            page: {
                title: "Applications - Internet Passport",
                description: "manage application",
            },
            path: req.path,
        });
    }
}
exports.default = DeveloperController;
//# sourceMappingURL=DeveloperController.js.map