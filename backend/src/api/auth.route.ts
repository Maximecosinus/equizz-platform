import { Router } from "express";
import { registerUser} from "../core/auth.controller";

const router = Router();
router.post('/register', registerUser);

export default router;