import { Router } from "express";
import { register, login, getAuthUser } from '../../controllers/auth.controller';
import { isAuthenticated } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getAuthUser);

export default router;

