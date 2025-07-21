import { Router } from "express";
import {
  getAllUsers,
  getMe,
  deleteUser,
  searchUsers,
} from "../../controllers/user.controller";
import { isAuthenticated, allowRoles } from "../../middleware/auth.middleware";

const router = Router();

router.get("/me", isAuthenticated, getMe);
router.get("/", isAuthenticated, allowRoles("admin"), getAllUsers);
router.get("/search", isAuthenticated, allowRoles("admin"), searchUsers);
router.delete("/:id", isAuthenticated, allowRoles("admin"), deleteUser);

export default router;
