import {Field, InputType} from "type-graphql";

@InputType()
export class BaseRequestSchema {
    @Field(() => Date, {defaultValue: Date.now()})
    createdAt!: Date;

    @Field(() => Date,  {defaultValue: Date.now()})
    updatedAt!: Date;

    @Field(() => Date, { nullable: true })
    deletedAt?: Date;
}