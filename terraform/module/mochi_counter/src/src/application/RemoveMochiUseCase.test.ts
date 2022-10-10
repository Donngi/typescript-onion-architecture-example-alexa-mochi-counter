import { MochiCountRepository, ResultMochiCount } from "../domain/MochiCountRepository";
import { RemoveMochiUseCase } from "./RemoveMochiUseCase"

class mockMochiRepository implements MochiCountRepository {
    addMochi(person: string, mochiCount: number): Promise<ResultMochiCount> {
        throw new Error("Method not implemented.");
    }

    removeMochi(person: string, mochiCount: number): Promise<ResultMochiCount> {
        return new Promise<ResultMochiCount>((resolve) => {
            resolve({
                person: person,
                mochiCount: 10 - mochiCount
            })
        })
    }
}

test('Remove two mochi from Taro. Taro had 10 mochi initially.', async () => {
    const repository = new mockMochiRepository()
    const spyRemoveMochi = jest.spyOn(repository, "removeMochi")

    const usecase = new RemoveMochiUseCase(repository)

    expect.assertions(2)
    const result = await usecase.run('Taro', 2)
    expect(result).toStrictEqual({ status: 'ok', result: { person: 'Taro', mochiCount: 8 } })
    expect(spyRemoveMochi).toHaveBeenCalledTimes(1)
})

test('Some error occured during removing mochi.', async () => {
    const repository = new mockMochiRepository()
    let error = new Error("Some error occured.")
    const spyAddMochi = jest.spyOn(repository, "removeMochi").mockImplementation(() => {
        throw error
    })

    const usecase = new RemoveMochiUseCase(repository)

    expect.assertions(2)
    const result = await usecase.run('Taro', 1)
    expect(result).toStrictEqual({ status: 'ng', error: error })
    expect(spyAddMochi).toHaveBeenCalledTimes(1)
})