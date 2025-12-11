import { DataSource } from "typeorm"
import { User } from "./entities/user"

const AppDataSource = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "educa_match",
    synchronize: true,
    logging: true,
    entities: [User],
    subscribers: [],
    migrations: []
})

export default AppDataSource