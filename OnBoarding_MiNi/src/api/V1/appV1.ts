import "reflect-metadata";
import fastify from "fastify";
import { AppDataSource } from "../../utils/db/dataSource";
import userRoutesV1 from "./UserControllerV1";
import runningRoutesV1 from "./SingleRunControllerV1";

// Fastify 인스턴스 생성
const appV1 = fastify({ logger: true });

// JSON 본문 파싱 설정 (필요시)
appV1.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
    try {
        const json = JSON.parse(body as string);
        done(null, json);
    } catch (err) {
        done(err as Error, undefined);
    }
});

// 데이터베이스 연결
AppDataSource.initialize()
    .then(() => {
        appV1.log.info("데이터베이스 연결 성공");
    })
    .catch((error) => {
        appV1.log.error("데이터베이스 연결 중 오류 발생:", error);
    });

// 라우트 등록 - Fastify 플러그인 방식으로
appV1.register(userRoutesV1, { prefix: '/api/V1/user' });
appV1.register(runningRoutesV1, { prefix: '/api/V1/single-run' });

// 등록된 라우트 확인을 위한 디버깅
appV1.ready().then(() => {
    console.log('등록된 라우트:');
    console.log(appV1.printRoutes());
});

// 서버 시작
const PORT = process.env.PORT || 3000;
const start = async () => {
    try {
        await appV1.listen({ port: Number(PORT), host: '0.0.0.0' });
        appV1.log.info(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    } catch (err) {
        appV1.log.error(err);
        process.exit(1);
    }
};

start();