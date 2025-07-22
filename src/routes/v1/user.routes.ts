import { Router } from "express";
import {
  getAllUsers,
  deleteUser,
  searchUsers,
  getUserById,
  updateUser,
} from "../../controllers/user.controller";
import { isAuthenticated, allowRoles } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", isAuthenticated, allowRoles("ADMIN"), getAllUsers);
router.get("/search", isAuthenticated, allowRoles("ADMIN"), searchUsers);
router.get("/:id", isAuthenticated, allowRoles("ADMIN"), getUserById);
router.put("/:id", isAuthenticated, allowRoles("ADMIN"), updateUser);
router.delete("/:id", isAuthenticated, allowRoles("ADMIN"), deleteUser);

export default router;
