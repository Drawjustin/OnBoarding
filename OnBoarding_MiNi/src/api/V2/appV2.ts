// // server.ts - Fastify와 Apollo Server 통합
// import Fastify from 'fastify';
// import { ApolloServer } from '@apollo/server';
// import { fastifyApolloDrainPlugin, fastifyApolloHandler } from '@as-integrations/fastify';
// import { typeDefs } from './schema/schema';  // typeDefs 임포트
// import { resolvers } from './resolver/resolver';  // resolvers 임포트
// // import { createContext } from './context';  // context 함수 임포트
//
// // Fastify 인스턴스 생성
// const fastify = Fastify();
//
// // Apollo Server 인스턴스 생성
// const apolloServer = new ApolloServer({
//     typeDefs,  // 임포트한 typeDefs 사용
//     resolvers, // 임포트한 resolvers 사용
//     plugins: [fastifyApolloDrainPlugin(fastify)]
// });
//
// // 서버 시작 함수
// const startServer = async () => {
//     await apolloServer.start();
//
//     // GraphQL 엔드포인트 등록
//     fastify.route({
//         url: '/graphql',
//         method: ['GET', 'POST'],
//         handler: fastifyApolloHandler(apolloServer, {
//             context: async (request) => createContext({ req: request.raw })
//         })
//     });
//
//     try {
//         // Fastify 서버 시작
//         const address = await fastify.listen({ port: 4000, host: '0.0.0.0' });
//         console.log(`🚀 서버 실행 중: ${address}/graphql`);
//     } catch (err) {
//         fastify.log.error(err);
//         process.exit(1);
//     }
// };
//
// startServer();