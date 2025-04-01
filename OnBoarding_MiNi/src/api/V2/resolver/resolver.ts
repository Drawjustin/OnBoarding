// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import { PrismaClient } from '@prisma/client';
//
// // 실제 프로젝트에서는 환경 변수로 관리해야 합니다
// const SECRET_KEY = 'your-secret-key';
//
// export const resolvers = {
//     Query: {
//         // 사용자의 모든 러닝 기록을 가져오는 리졸버
//         runningRecords: async (_, args, context) => {
//             // 인증 확인
//             if (!context.userId) {
//                 throw new Error('인증이 필요합니다');
//             }
//
//             // 현재 로그인한 사용자의 러닝 기록만 반환
//             return await context.prisma.runningRecord.findMany({
//                 where: {
//                     userId: context.userId
//                 },
//                 select: {
//                     id: true,
//                     date: true,
//                     distance: true,
//                     duration: true
//                 }
//             });
//         },
//
//         // 특정 러닝 기록의 상세 정보를 가져오는 리졸버
//         runningRecord: async (_, { id }, context) => {
//             // 인증 확인
//             if (!context.userId) {
//                 throw new Error('인증이 필요합니다');
//             }
//
//             // ID로 러닝 기록 찾기
//             const record = await context.prisma.runningRecord.findUnique({
//                 where: { id }
//             });
//
//             // 기록이 없거나 다른 사용자의 기록인 경우
//             if (!record || record.userId !== context.userId) {
//                 throw new Error('러닝 기록을 찾을 수 없습니다');
//             }
//
//             return record;
//         }
//     },
//
//     Mutation: {
//         // 회원가입 리졸버
//         signup: async (_, { email, password }, context) => {
//             // 이메일 중복 확인
//             const existingUser = await context.prisma.user.findUnique({
//                 where: { email }
//             });
//
//             if (existingUser) {
//                 throw new Error('이미 사용 중인 이메일입니다');
//             }
//
//             // 비밀번호 해싱
//             const hashedPassword = await bcrypt.hash(password, 10);
//
//             // 사용자 생성
//             const user = await context.prisma.user.create({
//                 data: {
//                     email,
//                     password: hashedPassword
//                 }
//             });
//
//             // JWT 토큰 생성
//             const token = jwt.sign({ userId: user.id }, SECRET_KEY);
//
//             return {
//                 token,
//                 user
//             };
//         },
//
//         // 로그인 리졸버
//         login: async (_, { email, password }, context) => {
//             // 이메일로 사용자 찾기
//             const user = await context.prisma.user.findUnique({
//                 where: { email }
//             });
//
//             if (!user) {
//                 throw new Error('사용자를 찾을 수 없습니다');
//             }
//
//             // 비밀번호 확인
//             const isValidPassword = await bcrypt.compare(password, user.password);
//
//             if (!isValidPassword) {
//                 throw new Error('잘못된 비밀번호입니다');
//             }
//
//             // JWT 토큰 생성
//             const token = jwt.sign({ userId: user.id }, SECRET_KEY);
//
//             return {
//                 token,
//                 user
//             };
//         },
//
//         // 러닝 기록 생성 리졸버
//         createRunningRecord: async (_, { distance, duration, pace, heartRate, date }, context) => {
//             // 인증 확인
//             if (!context.userId) {
//                 throw new Error('인증이 필요합니다');
//             }
//
//             // 러닝 기록 생성
//             return await context.prisma.runningRecord.create({
//                 data: {
//                     distance,
//                     duration,
//                     pace,
//                     heartRate,
//                     date,
//                     user: { connect: { id: context.userId } }
//                 }
//             });
//         },
//
//         // 러닝 기록 삭제 리졸버
//         deleteRunningRecord: async (_, { id }, context) => {
//             // 인증 확인
//             if (!context.userId) {
//                 throw new Error('인증이 필요합니다');
//             }
//
//             // 삭제할 러닝 기록 찾기
//             const record = await context.prisma.runningRecord.findUnique({
//                 where: { id }
//             });
//
//             // 기록이 없거나 다른 사용자의 기록인 경우
//             if (!record || record.userId !== context.userId) {
//                 throw new Error('삭제할 수 없는 러닝 기록입니다');
//             }
//
//             // 러닝 기록 삭제
//             await context.prisma.runningRecord.delete({
//                 where: { id }
//             });
//
//             return true;
//         }
//     }
// };