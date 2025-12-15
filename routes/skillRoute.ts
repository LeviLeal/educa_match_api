import { Router } from "express";
import {
  createSkill,
  listSkills,
} from "../controllers/skillController";

const router = Router();

router.post("/create/", createSkill);
router.post("/list/", listSkills);

export default router;
