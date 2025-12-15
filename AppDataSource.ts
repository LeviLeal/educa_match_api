import { DataSource } from "typeorm"
import { User } from "./entities/UserEntity"
import { Skill } from "./entities/SkillEntity"

const AppDataSource = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "educa_match",
    synchronize: true,
    logging: true,
    entities: [User, Skill],
    subscribers: [],
    migrations: []
})

export default AppDataSource