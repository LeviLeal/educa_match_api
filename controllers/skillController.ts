import { Request, Response } from "express";
import AppDataSource from "../AppDataSource";
import { Skill } from "../entities/SkillEntity";

const skillRepository = AppDataSource.getRepository(Skill);

export const createSkill = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "ERROR",
        msg: "Skill name is required",
      });
    }

    const skillExists = await skillRepository.findOne({
      where: { name },
    });

    if (skillExists) {
      return res.status(400).json({
        status: "ERROR",
        msg: "Skill is already registred",
      });
    }

    const newSkill = new Skill();
    newSkill.name = name;

    const result = await skillRepository.save(newSkill);

    return res.json({
      status: "OK",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      msg: "Erro creating skill",
    });
  }
};

export const listSkills = async (_req: Request, res: Response) => {
  try {
    const skills = await skillRepository.find();

    return res.json({
      status: "OK",
      data: skills,
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      msg: "Erro listing skills",
    });
  }
};
