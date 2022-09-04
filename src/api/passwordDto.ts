import {PasswordEntry} from '../model/password.entity'
import {ApiProperty} from "@nestjs/swagger"


export class PasswordDto {
    @ApiProperty()
    public id: string

    @ApiProperty()
    public server: string

    @ApiProperty()
    public login: string

    @ApiProperty()
    public password: string

    public static from(passwordEntry: PasswordEntry): PasswordDto {
        const dto = new PasswordDto()
        dto.id = passwordEntry._id.toHexString()
        dto.server = passwordEntry.server
        dto.login = passwordEntry.login
        dto.password = passwordEntry.password
        return dto
    }
}
