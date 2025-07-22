import { Router } from "express";
import {
  getAllUsers,
  getMe,
  deleteUser,
  searchUsers,
  updateUser,
} from "../../controllers/user.controller";
import { isAuthenticated, allowRoles } from "../../middleware/auth.middleware";
import { validateRequest, userValidationRules } from "../../middleware/validation.middleware";

const router = Router();

// Protected routes - require authentication
router.use(isAuthenticated);

router.get("/me", getMe);
router.get("/", allowRoles("admin"), getAllUsers);
router.get("/search", allowRoles("admin"), searchUsers);
router.put("/:id", validateRequest(userValidationRules.update), updateUser);
router.delete("/:id", allowRoles("admin"), deleteUser);

export default router;
