import { AddMochiUseCase } from './AddMochiUseCase'
import { MochiCountRepository, ResultMochiCount } from '../domain/MochiCountRepository'

class mockMochiRepository implements MochiCountRepository {
    addMochi(person: string, mochiCount: number): Promise<ResultMochiCount> {
        return new Promise<ResultMochiCount>((resolve) => {
            resolve({
                person: person,
                mochiCount: mochiCount
            })
        })
    }

    removeMochi(person: string, mochiCount: number): Promise<ResultMochiCount> {
        throw new Error('Method not implemented.')
    }
}

test('Add one mochi to Taro. Result: one mochi.', async () => {
    const repository = new mockMochiRepository()
    const spyAddMochi = jest.spyOn(repository, "addMochi")

    const usecase = new AddMochiUseCase(repository)

    expect.assertions(2)
    const result = await usecase.run('Taro', 1)
    expect(result).toStrictEqual({ status: 'ok', result: { person: 'Taro', mochiCount: 1 } })
    expect(spyAddMochi).toHaveBeenCalledTimes(1)
})

test('Some error occured during adding mochi.', async () => {
    const repository = new mockMochiRepository()
    let error = new Error("Some error occured.")
    const spyAddMochi = jest.spyOn(repository, "addMochi").mockImplementation(() => {
        throw error
    })

    const usecase = new AddMochiUseCase(repository)

    expect.assertions(2)
    const result = await usecase.run('Taro', 1)
    expect(result).toStrictEqual({ status: 'ng', error: error })
    expect(spyAddMochi).toHaveBeenCalledTimes(1)
})