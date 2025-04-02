import {Arg, ID, Mutation, Query, Resolver} from "type-graphql";
import {AppDataSource} from "../../../../utils/db/dataSource";
import {SingleRun} from "../../entities/SingleRun";
import {User} from "../../entities/User";
import {SingleRunRequest, SingleRunResponse} from "../schema/SingleRunSchema";


const singleRunRepository = AppDataSource.getRepository(SingleRun);
const userRepository = AppDataSource.getRepository(User);

@Resolver(of => SingleRunResponse)
export class SingleRunResolver {

    @Query(returns => [SingleRunResponse])
    async get_SingleRunAll(
    ): Promise<SingleRun[]> {
        return await singleRunRepository.find({
            relations: ['user']
        });
    }



    @Query(returns => [SingleRunResponse], { nullable: true })
    async get_SingleRunAllByUser(
        @Arg('userId', type => ID) userId: number
    ): Promise<SingleRun[]> {

        return await singleRunRepository.find({
            where: {user: {id: userId}},
            relations: ['user']
        });
    }

    @Query(returns => SingleRunResponse, { nullable: true })
    async get_SingleRun(
        @Arg('id', type => ID) id: number
    ): Promise<SingleRun|null> {
        return await singleRunRepository.findOne({
            where: {id: id},
            relations: ['user']
        });
    }


    @Mutation(returns => SingleRunResponse, {nullable: true})
    async add_SingleRun(
        @Arg('input', () => SingleRunRequest) SingleRunInput: SingleRunRequest
    ): Promise<SingleRunResponse|null> {
        try {

            const { totalDistance, totalTime, averageHeart, averagePace, userId } = SingleRunInput;

            // 사용자 레포지토리 가져오기

            const user = await userRepository.findOneBy({ id: userId });

            // user가 null인지 확인
            if (!user) {
                console.log("사용자를 찾을 수 없음");
                return null;
            }

            // 새 사용자 생성 및 저장
            const newSingleRun = singleRunRepository.create({
                totalDistance,
                totalTime,
                averagePace,
                averageHeart,
                user
            });

            return await singleRunRepository.save(newSingleRun);

        } catch (error) {
            console.error("add_SingleRun 에러:", error);
            return null;
        }
    }


    @Mutation(returns => SingleRunResponse, {nullable: true})
    async delete_SingleRun(
        @Arg('id', () => ID) id: number
    ): Promise<SingleRunResponse|null> {
        try {

            // 삭제할 기록 찾기
            const singleRunToDelete = await singleRunRepository.findOne({
                where: { id }
            });

            // 기록이 없으면 null 반환
            if (!singleRunToDelete) {
                console.log(`ID ${id}에 해당하는 기록을 찾을 수 없음`);
                return null;
            }

            return await singleRunRepository.softRemove(singleRunToDelete);
        } catch (error) {
            console.error("delete_SingleRun 에러:", error);
            return null;
        }
    }
}