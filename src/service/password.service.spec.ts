import {PasswordRepository} from "../repository/passwordRepository.service"
import {PasswordService} from "./password.service"
import {passwordEntry1, passwordEntry2} from "../api/__test/fixtures"
import {BadRequestException, NotFoundException} from "@nestjs/common"
import {UpdatePasswordDto} from "../api/updatePasswordDto"

describe('-- Password Service --', () => {

    const mockRepository = new PasswordRepository(null)
    const service = new PasswordService(mockRepository)

    beforeEach(() => {
        jest.resetModules()
    })

    describe('findById', () => {
        it('should return password when id and userId correct', async () => {
            const spyPassword = jest.spyOn(mockRepository, 'findById')
            spyPassword.mockImplementation(() => Promise.resolve(passwordEntry1()))

            await expect(service.findById("6311e9359490db305ec46e32", "user@gmail.com"))
                .resolves.toEqual(passwordEntry1())
        })

        it('should return bad request when id is not correct', async () => {
            await expect(service.findById("ABC", "user@gmail.com"))
                .rejects.toThrow(BadRequestException)
        })

        it('should return not found when id of another user', async () => {
            const spyPassword = jest.spyOn(mockRepository, 'findById')
            spyPassword.mockImplementation(() => Promise.resolve(passwordEntry1()))

            await expect(service.findById("6311e9359490db305ec46e32", "different_user@gmail.com"))
                .rejects.toThrow(NotFoundException)
        })
    })

    describe('update', () => {
        const updateDto = {
            server: "my_server",
            login: "Alois",
            password: "my_password"
        } as UpdatePasswordDto

        it('should update password when id and userId correct', async () => {
            const spyPassword = jest.spyOn(mockRepository, 'findById')
            spyPassword.mockImplementation(() => Promise.resolve(passwordEntry1()))
            const spyUpdatePassword = jest.spyOn(mockRepository, 'update')
            spyUpdatePassword.mockImplementation(() => Promise.resolve(passwordEntry2()))

            await expect(service.update("6311e9359490db305ec46e32", "user@gmail.com", updateDto))
                .resolves.toEqual(passwordEntry2())
        })

        it('should return bad request when body is empty', async () => {
            await expect(service.update("ABC", "user@gmail.com", {} as UpdatePasswordDto))
                .rejects.toThrow(BadRequestException)
        })

        it('should return bad request when id is not correct', async () => {
            await expect(service.update("ABC", "user@gmail.com", updateDto))
                .rejects.toThrow(BadRequestException)
        })

        it('should return not found when id of another user', async () => {
            const spyPassword = jest.spyOn(mockRepository, 'findById')
            spyPassword.mockImplementation(() => Promise.resolve(passwordEntry1()))

            await expect(service.update("6311e9359490db305ec46e32", "different_user@gmail.com", updateDto))
                .rejects.toThrow(NotFoundException)
        })
    })

    describe('delete', () => {
        it('should delete password when id and userId correct', async () => {
            const spyPassword = jest.spyOn(mockRepository, 'findById')
            spyPassword.mockImplementation(() => Promise.resolve(passwordEntry1()))
            const spyDeletePassword = jest.spyOn(mockRepository, 'delete')
            spyDeletePassword.mockImplementation(() => Promise.resolve(true))

            await expect(service.delete("6311e9359490db305ec46e32", "user@gmail.com")).resolves
        })

        it('should return bad request when id is not correct', async () => {
            await expect(service.delete("ABC", "user@gmail.com"))
                .rejects.toThrow(BadRequestException)
        })

        it('should return not found when id of another user', async () => {
            const spyPassword = jest.spyOn(mockRepository, 'findById')
            spyPassword.mockImplementation(() => Promise.resolve(passwordEntry1()))

            await expect(service.delete("6311e9359490db305ec46e32", "different_user@gmail.com"))
                .rejects.toThrow(NotFoundException)
        })
    })
})