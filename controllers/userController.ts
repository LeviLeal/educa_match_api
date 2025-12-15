import { Request, Response } from "express";
import AppDataSource from "../AppDataSource";
import { User } from "../entities/UserEntity";
import { Skill } from "../entities/SkillEntity";

const userRepository = AppDataSource.getRepository(User);
const skillRepository = AppDataSource.getRepository(Skill);

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);

        console.log(userId)
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ["skills"],
        });

        if (!user) {
            return res.status(404).json({
                status: "ERROR",
                msg: "User not found",
            });
        }

        user.password = "";

        return res.json({
            status: "OK",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            status: "ERROR",
            msg: "Error searching for user",
        });
    }
};


export const addSkillsToUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        // expects an array { "skillsIds" : [1, 2, etc] }
        const { skillIds } = req.body;

        if (!skillIds || !Array.isArray(skillIds)) {
            return res.status(400).json({
                status: "ERROR",
                msg: "skillIds has to be a skill id array",
            });
        }

        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ["skills"],
        });

        if (!user) {
            return res.status(404).json({
                status: "ERROR",
                msg: "User not found",
            });
        }

        const skills = await skillRepository.findByIds(skillIds);

        if (skills.length === 0) {
            return res.status(404).json({
                status: "ERROR",
                msg: "Couldn't find a skill",
            });
        }

        const existingSkillIds = user.skills.map(skill => skill.id);
        const newSkills = skills.filter(
            skill => !existingSkillIds.includes(skill.id)
        );

        user.skills = [...user.skills, ...newSkills];

        const result = await userRepository.save(user);

        return res.json({
            status: "OK",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            status: "ERROR",
            msg: "Error adding skills to the user",
        });
    }
};

export const removeSkillsFromUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        const { skillIds } = req.body;

        if (!skillIds || !Array.isArray(skillIds)) {
            return res.status(400).json({
                status: "ERROR",
                msg: "skillIds has to be an id array",
            });
        }

        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ["skills"],
        });

        if (!user) {
            return res.status(404).json({
                status: "ERROR",
                msg: "User not found",
            });
        }

        user.skills = user.skills.filter(
            skill => !skillIds.includes(skill.id)
        );

        const result = await userRepository.save(user);

        return res.json({
            status: "OK",
            data: result,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: "ERROR",
            msg: "Erro removing user skill",
        });
    }
};

export const listUserSkills = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);

        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ["skills"],
        });

        if (!user) {
            return res.status(404).json({
                status: "ERROR",
                msg: "User not found",
            });
        }

        return res.json({
            status: "OK",
            data: user.skills,
        });
    } catch (error) {
        return res.status(500).json({
            status: "ERROR",
            msg: "Error listing user skills",
        });
    }
};
export const listUsersBySkill = async (req: Request, res: Response) => {
    try {
        const skillId = Number(req.params.skillId);

        const skill = await skillRepository.findOne({
            where: { id: skillId },
            relations: ["users"],
        });

        if (!skill) {
            return res.status(404).json({
                status: "ERROR",
                msg: "Skill not found",
            });
        }

        skill.users = skill.users.map(user => {
            user.password = "";
            return user;
        });

        return res.json({
            status: "OK",
            data: skill.users,
        });
    } catch (error) {
        return res.status(500).json({
            status: "ERROR",
            msg: "Error listing user by skill",
        });
    }
};
