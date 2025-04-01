// src/api/v1/auth.ts (User 관련 API)
import { Router, Request, Response } from "express";
import { AppDataSource } from "../../utils/db/dataSource";
import { User } from "../../entities/User";
import * as bcrypt from "bcrypt"; // 비밀번호 암호화를 위한 라이브러리 (추가 설치 필요)
import * as jwt from "jsonwebtoken"; // JWT 토큰 생성을 위한 라이브러리 (추가 설치 필요)

const router = Router();

// 회원가입 API
router.post("/register", async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
        }

        const userRepository = AppDataSource.getRepository(User);

        // 이메일 중복 확인
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            return res.status(409).json({ message: "이미 등록된 이메일입니다." });
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

        return res.status(201).json(userResponse);
    } catch (error) {
        console.error("회원가입 중 오류 발생:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});

// 로그인 API
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "이메일과 비밀번호를 입력해주세요." });
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email });

        if (!user) {
            return res.status(401).json({ message: "이메일 또는 비밀번호가 일치하지 않습니다." });
        }

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "이메일 또는 비밀번호가 일치하지 않습니다." });
        }

        // JWT 토큰 생성
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || "default_secret_key",
            { expiresIn: "1h" }
        );

        return res.status(200).json({
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
        console.error("로그인 중 오류 발생:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});

export default router;