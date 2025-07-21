"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../../controllers/user.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/me", auth_middleware_1.isAuthenticated, user_controller_1.getMe);
router.get("/", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.allowRoles)("admin"), user_controller_1.getAllUsers);
router.get("/search", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.allowRoles)("admin"), user_controller_1.searchUsers);
router.delete("/:id", auth_middleware_1.isAuthenticated, (0, auth_middleware_1.allowRoles)("admin"), user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map