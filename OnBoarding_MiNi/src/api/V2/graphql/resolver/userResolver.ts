import {Arg, Int, Mutation, Query, Resolver} from "type-graphql";
import {AppDataSource} from "../../../../utils/db/dataSource";
import {User} from "../../entities/User";
import {UserRequest, UserResponse} from "../schema/userSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userRepository = AppDataSource.getRepository(User);

@Resolver(UserResponse)
export class UserResolver {
    @Query(returns => UserResponse)
    async get_user(
        @Arg('id', type => Int) id: number
    ): Promise<UserResponse|null> {

        return await userRepository.findOne({
            where: {id}
        });
    }

    @Mutation(returns => UserResponse)
    async add_user(
        @Arg('input', () => UserRequest) userInput: UserRequest
    ): Promise<UserResponse|null> {
        try {
            const { name, email, password, isAdmin } = userInput;

            // 필수 필드 검증
            if (!name || !email || !password) {
                console.log("필수 필드 누락");
                return null;
            }
            // 이메일 중복 확인
            const existingUser = await userRepository.findOneBy({ email });

            if (existingUser) {
                console.log("이미 존재하는 이메일:", email);
                return null;
            }

            // 비밀번호 암호화
            const hashedPassword = await bcrypt.hash(password, 10);

            // 새 사용자 생성 및 저장
            const newUser = userRepository.create({
                name,
                email,
                password: hashedPassword,
                isAdmin: isAdmin ?? false,
                refreshToken : "tempToken"
            });

            const savedUser = await userRepository.save(newUser);
            const { password: _, ...userResponse } = savedUser;

            return userResponse;
        } catch (error) {
            console.error("add_user 에러:", error);
            return null;
        }
    }



    @Mutation(returns => UserResponse)
    async login_user(
        @Arg('input', () => UserRequest) userInput: UserRequest
    ): Promise<UserResponse | null> {
        try {
            const { email, password } = userInput;

            if (!email) {
                console.error("이메일이 제공되지 않았습니다.");
                return null;
            }

            if (password === undefined || password === null || password === '') {
                console.error("비밀번호가 제공되지 않았습니다.");
                return null;
            }

            const user = await userRepository.findOne({
                where: { email }
            });

            if (!user) {
                console.error("사용자를 찾을 수 없습니다:", email);
                return null;
            }

            // 비밀번호 비교
            // user.password가 null이거나 undefined인 경우를 확인
            if (!user.password) {
                console.error("사용자의 비밀번호 데이터가 없습니다:", email);
                return null;
            }

            try {
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    console.error("비밀번호가 일치하지 않습니다:", email);
                    return null;
                }
            } catch (bcryptError) {
                console.error("비밀번호 비교 중 오류 발생:", bcryptError);
                return null;
            }

            // JWT 토큰 생성
            const secret = process.env.JWT_SECRET  || "default_secret_key";

            // secret이 정의되었음을 TypeScript에 명시적으로 알려줍니다
            const token = jwt.sign(
                { userId: user.id, email: user.email, isAdmin: user.isAdmin },
                secret as string,
                { expiresIn: '1h' }
            );

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                refreshToken: token
            };
        } catch (error) {
            console.error("로그인 에러:", error);
            throw new Error("로그인 처리 중 오류가 발생했습니다.");
        }
    }
}