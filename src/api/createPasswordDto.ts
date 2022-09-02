import {IsNotEmpty} from "class-validator"
import {ApiProperty} from "@nestjs/swagger"

export class CreatePasswordDto {

    @ApiProperty()
    @IsNotEmpty()
    public server: string

    @ApiProperty()
    @IsNotEmpty()
    public login: string

    @ApiProperty()
    @IsNotEmpty()
    public password: string
}
