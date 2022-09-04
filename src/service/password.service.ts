import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common'
import {ObjectId} from 'mongodb'
import {PasswordRepository} from '../repository/passwordRepository.service'
import {PasswordEntry} from '../model/password.entity'
import {UpdatePasswordDto} from "../api/updatePasswordDto"

@Injectable()
export class PasswordService {
    constructor(
        private readonly passwordRepository: PasswordRepository,
    ) {
    }

    public async findById(id: string, userId): Promise<PasswordEntry> {
        return await this.getValidatedPasswordEntry(id, userId)
    }

    public async searchPassword(userId: string, serverSearch?: string, loginSearch?: string): Promise<PasswordEntry[]> {
        return await this.passwordRepository.findBy(userId, serverSearch, loginSearch)
    }

    public async create(
        userId: string,
        server: string,
        login: string,
        password: string,
    ): Promise<ObjectId> {
        return await this.passwordRepository.create(PasswordEntry.from(userId, server, login, password))
    }

    public async update(id: string, userId: string, data: UpdatePasswordDto) {
        if (!data.server && !data.login && !data.password) {

            throw new BadRequestException()
        }

        await this.getValidatedPasswordEntry(id, userId)

        return await this.passwordRepository.update(id, data)
    }

    public async delete(id: string, userId) {
        await this.getValidatedPasswordEntry(id, userId)
        const ack = await this.passwordRepository.delete(id)
        if (!ack) {
            throw new Error("Password deletion failed!")
        }
    }

    private async getValidatedPasswordEntry(id: string, userId: string): Promise<PasswordEntry> {
        if (!ObjectId.isValid(id)) {
            throw new BadRequestException("'" + id + "' is not a valid id!")
        }

        const entry = await this.passwordRepository.findById(id)
        if (!entry) {
            throw new NotFoundException()
        }
        if (entry.userId !== userId) {
            throw new NotFoundException()
        }
        return entry
    }
}
