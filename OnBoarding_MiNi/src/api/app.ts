import "reflect-metadata";
import fastify from "fastify";
import { AppDataSource } from "../utils/db/dataSource";
import userRoutes from "../api/V1/UserControllerV1";
import runningRoutes from "../api/V1/SingleRunControllerV1";

// Fastify 인스턴스 생성
const app = fastify({ logger: true });

// JSON 본문 파싱 설정 (필요시)
app.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
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
        app.log.info("데이터베이스 연결 성공");
    })
    .catch((error) => {
        app.log.error("데이터베이스 연결 중 오류 발생:", error);
    });

// 라우트 등록 - Fastify 플러그인 방식으로
app.register(userRoutes, { prefix: '/api/V1/user' });
app.register(runningRoutes, { prefix: '/api/V1/single-run' });

// 등록된 라우트 확인을 위한 디버깅
app.ready().then(() => {
    console.log('등록된 라우트:');
    console.log(app.printRoutes());
});

// 서버 시작
const PORT = process.env.PORT || 3000;
const start = async () => {
    try {
        await app.listen({ port: Number(PORT), host: '0.0.0.0' });
        app.log.info(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();