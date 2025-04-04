import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AppDataSource } from "../../utils/db/dataSource";
import { User } from "./entities/User";
import { SingleRun } from "./entities/SingleRun";

// Fastify 플러그인 형태로 라우트 정의
export default async function runningRoutes(fastify: FastifyInstance) {
    // 사용자를 입력받아서 해당사용자의 모든 런닝기록리스트 조회하는 api
    fastify.get("/user/:userId", async (request: FastifyRequest<{
        Params: { userId: string }
    }>, reply: FastifyReply) => {
        try {
            const userId = parseInt(request.params.userId);

            // 사용자 존재 여부 확인
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: userId });

            if (!user) {
                return reply.code(404).send({ message: "사용자를 찾을 수 없습니다." });
            }

            // 런닝 기록 조회
            const runRepository = AppDataSource.getRepository(SingleRun);
            const runs = await runRepository.find({
                where: {
                    user: { id: userId },
                    isDeleted: false
                },
                order: { createdAt: "DESC" }
            });

            return runs;
        } catch (error) {
            fastify.log.error("런닝 기록 조회 중 오류 발생:", error);
            return reply.code(500).send({ message: "서버 오류가 발생했습니다." });
        }
    });

    // 런닝기록(pk)를 입력받아서 조회하는 api
    fastify.get("/:runId", async (request: FastifyRequest<{
        Params: { runId: string }
    }>, reply: FastifyReply) => {
        try {
            const runId = parseInt(request.params.runId);

            const runRepository = AppDataSource.getRepository(SingleRun);
            const run = await runRepository.findOne({
                where: { id: runId, isDeleted: false },
                relations: { user: true }
            });

            if (!run) {
                return reply.code(404).send({ message: "런닝 기록을 찾을 수 없습니다." });
            }

            return run;
        } catch (error) {
            fastify.log.error("런닝 기록 조회 중 오류 발생:", error);
            return reply.code(500).send({ message: "서버 오류가 발생했습니다." });
        }
    });

    // 런닝기록(pk)를 입력받아서 삭제하는 api
    fastify.delete("/:runId", async (request: FastifyRequest<{
        Params: { runId: string }
    }>, reply: FastifyReply) => {
        try {
            const runId = parseInt(request.params.runId);

            const runRepository = AppDataSource.getRepository(SingleRun);
            const run = await runRepository.findOneBy({ id: runId, isDeleted: false });

            if (!run) {
                return reply.code(404).send({ message: "런닝 기록을 찾을 수 없습니다." });
            }

            // 소프트 딜리트 - isDeleted 필드를 true로 설정
            run.isDeleted = true;
            await runRepository.save(run);

            // 하드 딜리트를 원한다면 다음 코드 사용:
            // await runRepository.delete(runId);

            return { message: "런닝 기록이 삭제되었습니다." };
        } catch (error) {
            fastify.log.error("런닝 기록 삭제 중 오류 발생:", error);
            return reply.code(500).send({ message: "서버 오류가 발생했습니다." });
        }
    });

    // 사용자 pk와 런닝기록을 입력받아서 저장하는 api
    fastify.post("/", async (request: FastifyRequest<{
        Body: {
            userId: number;
            totalDistance: number;
            totalTime: number;
            averagePace: number;
            averageHeart?: number;
        }
    }>, reply: FastifyReply) => {
        try {
            const { userId, totalDistance, totalTime, averagePace, averageHeart } = request.body;

            if (!(userId && totalDistance && totalTime && averagePace)){
                return reply.code(400).send({ message: "필수 필드가 누락되었습니다." });
            }

            // 사용자 존재 여부 확인
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: userId });

            if (!user) {
                return reply.code(404).send({ message: "사용자를 찾을 수 없습니다." });
            }

            // 새 런닝 기록 생성
            const runRepository = AppDataSource.getRepository(SingleRun);
            const newRun = new SingleRun();
            newRun.totalDistance = totalDistance;
            newRun.totalTime = totalTime;
            newRun.averagePace = averagePace;
            newRun.averageHeart = averageHeart || 0; // 기본값 설정
            newRun.user = user;

            const savedRun = await runRepository.save(newRun);

            return reply.code(201).send(savedRun);
        } catch (error) {
            fastify.log.error("런닝 기록 저장 중 오류 발생:", error);
            return reply.code(500).send({ message: "서버 오류가 발생했습니다." });
        }
    });
}