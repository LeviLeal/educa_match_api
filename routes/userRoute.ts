import { Router } from "express";
import {
    addSkillsToUser,
    removeSkillsFromUser,
    listUserSkills,
    listUsersBySkill,
    getUserById
} from "../controllers/userController";

const userRoutes = Router();

userRoutes.get("/:userId/", getUserById);
userRoutes.get("/:skillId/users", listUsersBySkill);
userRoutes.get("/:userId/skills", listUserSkills);
userRoutes.post("/:userId/skills", addSkillsToUser);
userRoutes.delete("/:userId/skills", removeSkillsFromUser);


export default userRoutes;
