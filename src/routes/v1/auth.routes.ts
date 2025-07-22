import { Router } from "express";
import { register, login, refresh, logout } from '../../controllers/auth.controller';
import { validateRequest, authValidationRules } from '../../middleware/validation.middleware';

const router = Router();

router.post("/register", validateRequest(authValidationRules.register), register);
router.post("/login", validateRequest(authValidationRules.login), login);
router.post("/refresh", validateRequest(authValidationRules.refresh), refresh);
router.post("/logout", logout);

export default router;

