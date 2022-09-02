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

    public static from(bankAccount: PasswordEntry): PasswordDto {
        const dto = new PasswordDto()
        dto.id = bankAccount._id.toHexString()
        dto.server = bankAccount.server
        dto.login = bankAccount.login
        dto.password = bankAccount.password
        return dto
    }
}
