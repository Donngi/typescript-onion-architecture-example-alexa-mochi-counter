import { MochiCountRepository } from "../domain/MochiCountRepository";

export class AddMochiUseCase {
  repository: MochiCountRepository

  constructor(repository: MochiCountRepository) {
    this.repository = repository
  }

  async run(this: AddMochiUseCase, person: string, mochiCount: number) {
    try {
      const result = await this.repository.addMochi(person, mochiCount)
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
};

export interface AddMochiUseCaseResult {
  status: "ok" | "ng";
  result?: {
    person: string,
    mochiCount: number
  };
  error?: Error
}
