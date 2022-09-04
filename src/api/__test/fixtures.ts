import {ObjectId} from "mongodb"
import {PasswordEntry} from "../../model/password.entity"
import {PasswordDto} from "../passwordDto"

export const passwordEntry1 = (): PasswordEntry => {
    return {
        _id: ObjectId.createFromHexString("6311e9359490db305ec46e32"),
        userId: "user@gmail.com",
        server: "my_server",
        login: "login_name",
        password: "my_password"
    }
}

export const passwordEntry2 = (): PasswordEntry => {
    return {
        _id: ObjectId.createFromHexString("6311e9359490db305ec46e33"),
        userId: "user@gmail.com",
        server: "my_server2",
        login: "login_name2",
        password: "my_password2"
    }
}

export const passwordDto1 = (): PasswordDto => {
    return {
        id: "6311e9359490db305ec46e32",
        server: "my_server",
        login: "login_name",
        password: "my_password"
    }
}

export const passwordDto2 = (): PasswordDto => {
    return {
        id: "6311e9359490db305ec46e33",
        server: "my_server2",
        login: "login_name2",
        password: "my_password2"
    }
}