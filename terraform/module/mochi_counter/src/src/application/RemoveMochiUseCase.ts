import { MochiCountRepository } from "../domain/MochiCountRepository";

export class RemoveMochiUseCase {
    repository: MochiCountRepository

    constructor(repository: MochiCountRepository) {
        this.repository = repository
    }

    async run(this: RemoveMochiUseCase, person: string, mochiCount: number) {
        try {
            const result = await this.repository.removeMochi(person, mochiCount)
            return {
                status: 'ok',
                result: {
                    person: result.person,
                    mochiCount: result.mochiCount
                }
            }
        } catch (e) {
            return {
                status: 'ng',
                error: (e instanceof Error) ? e : new Error('unknown error')
            }
        }
    }
}

export interface RemoveMochiUseCaseResult {
    status: "ok" | "ng";
    result?: {
        person: string,
        mochiCount: number
    };
    error?: Error
}
