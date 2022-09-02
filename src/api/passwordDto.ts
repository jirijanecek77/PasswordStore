import {PasswordEntry} from '../model/password.entity'

export class PasswordDto {
    public id: string
    public server: string
    public login: string
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
