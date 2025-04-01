import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AppDataSource } from "../../utils/db/dataSource";
import { User } from "../V1/entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Fastify 플러그인 형태로 라우트 정의
export default async function userRoutes(fastify: FastifyInstance) {
    // 기본 경로
    fastify.get("/", async (request, reply) => {
        return { message: "User API" };
    });

    // 회원가입 라우트
    fastify.post("/register", async (request: FastifyRequest<{
        Body: {
            name: string;
            email: string;
            password: string;
        }
    }>, reply: FastifyReply) => {
        try {
            const { name, email, password } = request.body;

            if (!name || !email || !password) {
                return reply.code(400).send({ message: "필수 필드가 누락되었습니다." });
            }

            const userRepository = AppDataSource.getRepository(User);

            // 이메일 중복 확인
            const existingUser = await userRepository.findOneBy({ email });
            if (existingUser) {
                return reply.code(409).send({ message: "이미 등록된 이메일입니다." });
            }

            // 비밀번호 암호화
            const hashedPassword = await bcrypt.hash(password, 10);

            // 새 사용자 생성
            const newUser = new User();
            newUser.name = name;
            newUser.email = email;
            newUser.password = hashedPassword;

            const savedUser = await userRepository.save(newUser);

            // 비밀번호 필드 제외하고 응답
            const { password: _, ...userResponse } = savedUser;

            return reply.code(201).send(userResponse);
        } catch (error) {
            fastify.log.error("회원가입 중 오류 발생:", error);
            return reply.code(500).send({ message: "서버 오류가 발생했습니다." });
        }
    });

    // 로그인 API
    fastify.post("/login", async (request: FastifyRequest<{
        Body: {
            email: string;
            password: string;
        }
    }>, reply: FastifyReply) => {
        try {
            const { email, password } = request.body;

            if (!email || !password) {
                return reply.code(400).send({ message: "이메일과 비밀번호를 입력해주세요." });
            }

            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ email });

            if (!user) {
                return reply.code(401).send({ message: "이메일 또는 비밀번호가 일치하지 않습니다." });
            }

            // 비밀번호 검증
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return reply.code(401).send({ message: "이메일 또는 비밀번호가 일치하지 않습니다." });
            }

            // JWT 토큰 생성
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || "default_secret_key",
                { expiresIn: "1h" }
            );

            return reply.code(200).send({
                message: "로그인 성공",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin
                }
            });
        } catch (error) {
            fastify.log.error("로그인 중 오류 발생:", error);
            return reply.code(500).send({ message: "서버 오류가 발생했습니다." });
        }
    });

    // 여기에 다른 사용자 관련 라우트 추가
}