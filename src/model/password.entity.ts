import {ObjectId} from 'mongodb'

export class PasswordEntry {
    public _id: ObjectId

    public userId: string

    public server: string

    public login: string

    public password: string

    public static from(userId: string, server: string, login: string, password: string) {
        const entry = new PasswordEntry()
        entry.userId = userId
        entry.server = server
        entry.login = login
        entry.password = password
        return entry
    }
}
