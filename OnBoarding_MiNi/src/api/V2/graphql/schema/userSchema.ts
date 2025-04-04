import {ObjectType, Field, ID, InputType} from 'type-graphql'
@ObjectType() // type User { ...
export class UserResponse {
    @Field(type => ID)
    id!: number

    @Field(type => String)
    name!: string

    @Field(type => String)
    email!: string

    @Field(type => Boolean)
    isAdmin!: boolean

    @Field(type=> String)
    refreshToken!: string;
}



@InputType()// type User { ...
export class UserRequest {
    @Field(() => String)
    name!: string

    @Field(type => String)
    email!: string

    @Field(type => String)
    password!: string

    @Field(() => Boolean, {defaultValue: false})
    isAdmin!: boolean
}
