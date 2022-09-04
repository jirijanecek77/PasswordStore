import {ApiProperty} from "@nestjs/swagger"

export class UpdatePasswordDto {

    @ApiProperty()
    public server?: string

    @ApiProperty()
    public login?: string

    @ApiProperty()
    public password?: string
}
