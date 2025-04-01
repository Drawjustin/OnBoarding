// src/api/v1/SingleRunControllerV1.ts
import { Router, Request, Response } from "express";
import { AppDataSource } from "../../utils/db/dataSource";
import { User } from "../../entities/User";
import { SingleRun } from "../../entities/SingleRun";

const router = Router();

// 사용자를 입력받아서 해당사용자의 모든 런닝기록리스트 조회하는 api
router.get("/user/:userId", async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);

        // 사용자 존재 여부 확인
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: userId });

        if (!user) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
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

        return res.status(200).json(runs);
    } catch (error) {
        console.error("런닝 기록 조회 중 오류 발생:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});

// 런닝기록(pk)를 입력받아서 조회하는 api
router.get("/:runId", async (req: Request, res: Response) => {
    try {
        const runId = parseInt(req.params.runId);

        const runRepository = AppDataSource.getRepository(SingleRun);
        const run = await runRepository.findOne({
            where: { id: runId, isDeleted: false },
            relations: { user: true }
        });

        if (!run) {
            return res.status(404).json({ message: "런닝 기록을 찾을 수 없습니다." });
        }

        return res.status(200).json(run);
    } catch (error) {
        console.error("런닝 기록 조회 중 오류 발생:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});

// 런닝기록(pk)를 입력받아서 삭제하는 api
router.delete("/:runId", async (req: Request, res: Response) => {
    try {
        const runId = parseInt(req.params.runId);

        const runRepository = AppDataSource.getRepository(SingleRun);
        const run = await runRepository.findOneBy({ id: runId, isDeleted: false });

        if (!run) {
            return res.status(404).json({ message: "런닝 기록을 찾을 수 없습니다." });
        }

        // 소프트 딜리트 - isDeleted 필드를 true로 설정
        run.isDeleted = true;
        await runRepository.save(run);

        // 하드 딜리트를 원한다면 다음 코드 사용:
        // await runRepository.delete(runId);

        return res.status(200).json({ message: "런닝 기록이 삭제되었습니다." });
    } catch (error) {
        console.error("런닝 기록 삭제 중 오류 발생:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});

// 사용자 pk와 런닝기록을 입력받아서 저장하는 api
router.post("/", async (req: Request, res: Response) => {
    try {
        const { userId, totalDistance, totalTime, averagePace, averageHeart } = req.body;

        if (!userId || !totalDistance || !totalTime || !averagePace) {
            return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
        }

        // 사용자 존재 여부 확인
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: userId });

        if (!user) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
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

        return res.status(201).json(savedRun);
    } catch (error) {
        console.error("런닝 기록 저장 중 오류 발생:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});

export default router;