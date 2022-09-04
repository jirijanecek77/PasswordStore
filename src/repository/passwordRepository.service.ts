import {Inject, Injectable} from '@nestjs/common'
import {MongoClient, ObjectId} from 'mongodb'
import {MONGODB_CLIENT} from '../constants'
import {PasswordEntry} from '../model/password.entity'
import {UpdatePasswordDto} from "../api/updatePasswordDto"

const PASSWORDS_COLLECTION = 'passwords'

@Injectable()
export class PasswordRepository {
    constructor(
        @Inject(MONGODB_CLIENT) private readonly mongoClient: MongoClient,
    ) {
    }

    public async create(entry: PasswordEntry): Promise<ObjectId> {
        const result = await this.mongoClient
            .db(process.env.DB_NAME)
            .collection<PasswordEntry>(PASSWORDS_COLLECTION)
            .insertOne(entry)
        return result.insertedId
    }

    public async findBy(userId: string, serverSearch?: string, loginSearch?: string): Promise<PasswordEntry[]> {
        const filter = {
            userId: userId,
            ...(serverSearch ? {server: {$regex: serverSearch, $options: 'i'}} : null),
            ...(loginSearch ? {login: {$regex: loginSearch, $options: 'i'}} : null),
        }

        return this.mongoClient
            .db(process.env.DB_NAME)
            .collection<PasswordEntry>(PASSWORDS_COLLECTION)
            .find(filter)
            .toArray()
    }

    public async findById(id: string): Promise<PasswordEntry> {
        return this.mongoClient
            .db(process.env.DB_NAME)
            .collection<PasswordEntry>(PASSWORDS_COLLECTION)
            .findOne({_id: ObjectId.createFromHexString(id)})
    }

    public async update(id: string, data: UpdatePasswordDto) {
        return this.mongoClient
            .db(process.env.DB_NAME)
            .collection<PasswordEntry>(PASSWORDS_COLLECTION)
            .findOneAndUpdate(
                {_id: ObjectId.createFromHexString(id)},
                {$set: {...data}},
                {returnDocument: 'after'}
            ).then(e => e.value)
    }

    async delete(id: string): Promise<boolean> {
        return this.mongoClient
            .db(process.env.DB_NAME)
            .collection<PasswordEntry>(PASSWORDS_COLLECTION)
            .deleteOne({_id: ObjectId.createFromHexString(id)})
            .then(e => e.acknowledged)
    }
}
