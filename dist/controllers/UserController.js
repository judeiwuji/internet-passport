"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserController {
    getDashboard(req, res) {
        res.render("user/dashboard", {
            page: {
                title: "Dashboard - Internet Passport",
                description: "Manage connected apps and devices",
            },
            path: req.path,
        });
    }
    getProfile(req, res) {
        res.render("user/profile", {
            page: {
                title: "Profile - Internet Passport",
                description: "Edit your account profile",
            },
            path: req.path,
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map