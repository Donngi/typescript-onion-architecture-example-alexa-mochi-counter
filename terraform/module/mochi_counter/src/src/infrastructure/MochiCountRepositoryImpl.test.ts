import { MochiCountRepositoryImpl } from "./MochiCountRepositoryImpl"
import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb"

test('Add two mochi to Taro.', async () => {
    const count = 2

    const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
    const mockDynamoDBClient = mockClient(DynamoDBDocumentClient)
    mockDynamoDBClient.on(UpdateCommand).resolves({
        Attributes: {
            'person': 'Taro',
            'mochi-count': 0 + count
        }
    })

    const repository = new MochiCountRepositoryImpl(client, 'mock')

    expect.assertions(1)
    const result = await repository.addMochi('Taro', count)
    expect(result).toStrictEqual({ person: 'Taro', mochiCount: 2 })
})

test('Some error occured during adding mochi.', async () => {
    const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))

    const mockDynamoDBClient = mockClient(DynamoDBDocumentClient)
    mockDynamoDBClient.on(UpdateCommand).rejects('Some error occured.')

    const repository = new MochiCountRepositoryImpl(client, 'mock')

    const promise = repository.addMochi('Taro', 2)
    await expect(promise).rejects.toThrow('Some error occured.')
})

test('Remove two mochi to Taro. Taro had 10 mochi initially.', async () => {
    const count = 2

    const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
    const mockDynamoDBClient = mockClient(DynamoDBDocumentClient)
    mockDynamoDBClient.on(UpdateCommand).resolves({
        Attributes: {
            'person': 'Taro',
            'mochi-count': 10 - count
        }
    })

    const repository = new MochiCountRepositoryImpl(client, 'mock')

    expect.assertions(1)
    const result = await repository.removeMochi('Taro', count)
    expect(result).toStrictEqual({ person: 'Taro', mochiCount: 8 })
})

test('Some error occured during removing mochi.', async () => {
    const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))

    const mockDynamoDBClient = mockClient(DynamoDBDocumentClient)
    mockDynamoDBClient.on(UpdateCommand).rejects('Some error occured.')

    const repository = new MochiCountRepositoryImpl(client, 'mock')

    const promise = repository.removeMochi('Taro', 2)
    await expect(promise).rejects.toThrow('Some error occured.')
})
