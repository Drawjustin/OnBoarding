// server.ts
import Fastify from 'fastify';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from '@apollo/server';
import { fastifyApolloDrainPlugin, fastifyApolloHandler } from '@as-integrations/fastify';
import { UserResolver } from './graphql/resolver/resolver';
import {AppDataSource} from "../../utils/db/dataSource";

const appV2 = Fastify({ logger: true });

AppDataSource.initialize()
    .then(() => {
        appV2.log.info("데이터베이스 연결 성공");
    })
    .catch((error) => {
        appV2.log.error("데이터베이스 연결 중 오류 발생:", error);
    });

const startServer = async () => {
    const schema = await buildSchema({
        resolvers: [UserResolver],
    });

    const apolloServer = new ApolloServer({
        schema,
        plugins: [fastifyApolloDrainPlugin(appV2)]
    });

    await apolloServer.start();

    appV2.route({
        url: '/graphql',
        method: ['GET', 'POST'],
        handler: fastifyApolloHandler(apolloServer, {
            // context 부분 제거 또는 간단한 객체 사용
            context: async (request) => ({ req: request.raw })
        })
    });

    try {
        const address = await appV2.listen({ port: 4000, host: '0.0.0.0' });
        console.log(`🚀 서버 실행 중: ${address}/graphql`);
    } catch (err) {
        appV2.log.error(err);
        process.exit(1);
    }
};

startServer();