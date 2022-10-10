export interface MochiCountRepository {
    addMochi(person: string, mochiCount: number): Promise<ResultMochiCount>

    removeMochi(person: string, mochiCount: number): Promise<ResultMochiCount>

}

export interface ResultMochiCount { person: string, mochiCount: number }