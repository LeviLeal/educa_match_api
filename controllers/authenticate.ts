import { Request, Response } from "express";
import AppDataSource from "../AppDataSource";
import { User } from "../entities/user";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export const registerUser = async (req: Request, res: Response) => {
    const userData = req.body;
    const newAluno = new User();
    const hashedPassword = await createHashPassword(userData.senha);

    newAluno.name = userData.nome;
    newAluno.email = userData.email;
    newAluno.password = hashedPassword;

    const result = await userRepository.save(newAluno);
    return res.json({
        status: "OK",
        data: result,
    });
};

export const loginUser = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.senha;

    const verification = await verifyPasswordByEmail(email, password);

    if (verification) {
        const user = await userRepository.findOne({ where: { email: email } });
        if (user) user.password = "";

        return res.json({
            status: "OK",
            msg: "User authenticated succefully",
            user_data: user,
        });
    } else {
        return res.json({
            status: "ERROR",
            msg: "Authentication error: Incorrect e-mail or password",
        });
    }
};

const verifyPasswordByEmail = async (email: string, password: string) => {

    const user = await userRepository.findOne({ where: { email: email } });

    if (user != null) {
        const hashedAlunoPassword = user?.password;
        if (!hashedAlunoPassword) return { sucesso: false };

        const isPasswordMatch = await bcrypt.compare(password, hashedAlunoPassword);

        if (isPasswordMatch)
            return true
        else return false

    } else {
        return false
    }
};

const createHashPassword = async (password: string) => {
    const saltHounds = 10;
    return await bcrypt.hash(password, saltHounds);
};
