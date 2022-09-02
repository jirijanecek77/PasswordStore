import {IsNotEmpty} from "class-validator"

export class CreatePasswordDto {

    @IsNotEmpty()
    public server: string

    @IsNotEmpty()
    public login: string

    @IsNotEmpty()
    public password: string
}
