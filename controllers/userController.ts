import { Request, Response } from "express";
import AppDataSource from "../AppDataSource";
import { User } from "../entities/UserEntity";

const userRepository = AppDataSource.getRepository(User);

export default {
  // GET all users
  async list(req: Request, res: Response) {
    try {
      const users = await userRepository.find({
        relations: ["interests", "skills", "preferences"],
      });

      return res.json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao listar usuários" });
    }
  },

  // GET user by id
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await userRepository.findOne({
        where: { id: Number(id) },
        relations: ["interests", "skills", "preferences"],
      });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  },

  // UPDATE core user data (email, name)
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      let user = await userRepository.findOne({
        where: { id: Number(id) },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      userRepository.merge(user, data);
      const updated = await userRepository.save(user);

      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Error updating user" });
    }
  },

  // DELETE /users/:id
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await userRepository.delete({ id: Number(id) });

      if (result.affected === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({ message: "User removed successfuly" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error trying to remove an user" });
    }
  },
};
