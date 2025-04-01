import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../../api/V1/entities/User";
import { SingleRun } from "../../api/V1/entities/SingleRun";
// 기타 필요한 엔티티들...

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "12345678",
    database: "test01",
    synchronize: true, // 개발 환경에서만 true 권장
    logging: true,
    entities: [User, SingleRun],
    migrations: [],
    subscribers: [],
});