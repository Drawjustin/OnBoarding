import {Field, ObjectType} from "type-graphql";

@ObjectType()
export class BaseResponseSchema {
    @Field(() => Date)
    createdAt!: Date;

    @Field(() => Date)
    updatedAt!: Date;

    @Field(() => Date, { nullable: true })
    deletedAt?: Date;
}