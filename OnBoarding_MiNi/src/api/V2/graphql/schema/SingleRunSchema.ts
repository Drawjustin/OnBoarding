import {ObjectType, Field, ID, InputType, Float} from 'type-graphql'
import {BaseResponseSchema} from "./baseSchema/baseResponseSchema";
import {BaseRequestSchema} from "./baseSchema/baseRequestSchema";
import {UserResponse} from "./userSchema";
@ObjectType()
export class SingleRunResponse extends BaseResponseSchema{
    @Field(type => ID)
    id!: number

    @Field(type => Float)
    totalDistance!: number

    @Field(type => Float)
    totalTime!: number

    @Field(type => Float)
    averagePace!: number

    @Field(type=> Float)
    averageHeart!: number

    @Field(() => UserResponse)
    user!: UserResponse;
}

@InputType()
export class SingleRunRequest extends BaseRequestSchema{

    @Field(() => Float, {defaultValue: 0})
    totalDistance!: number

    @Field(() => Float, {defaultValue: 0})
    totalTime!: number

    @Field(() => Float, {defaultValue: 0})
    averagePace!: number

    @Field(() => Float, {defaultValue: 0})
    averageHeart!: number

    @Field(() => ID)
    userId!: number;
}
