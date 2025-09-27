import { Router } from "express";
import { registerUser, loginUser} from "../core/auth.controller";

const router = Router();
//Inscription
router.post('/register', registerUser)

//Connexion
router.post('/login', loginUser);

export default router;