import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
    ErrorHandler,
    HandlerInput,
    RequestHandler,
    SkillBuilders,
} from 'ask-sdk-core';
import {
    IntentRequest,
    Response,
} from 'ask-sdk-model';
import { AddMochiUseCase } from '../application/AddMochiUseCase';
import { RemoveMochiUseCase } from '../application/RemoveMochiUseCase';
import { MochiCountRepositoryImpl } from '../infrastructure/MochiCountRepositoryImpl';



const LaunchRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest';
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = 'This is mochi counter. Tell me like "Add two mochi to Taro".like "Add mochi to Taro"';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Mochi How to use', speechText)
            .getResponse();
    },
};

const AddMochiIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AddMochiIntent';
    },
    async handle(handlerInput: HandlerInput): Promise<Response> {
        const request = handlerInput.requestEnvelope.request as IntentRequest
        const person = request.intent.slots?.['person'].value
        const count = request.intent.slots?.['count'].value
        if (person === undefined || count === undefined) {
            throw new Error(`Invalid slot: person: ${person}, count: ${count}`)
        }

        const ddb = new DynamoDBClient({})
        const client = DynamoDBDocumentClient.from(ddb)
        const dynamodbName = process.env.DYNAMODB_TABLE_NAME
        if (dynamodbName === undefined) {
            throw new Error('Invalid environment variable')
        }
        const repository = new MochiCountRepositoryImpl(client, dynamodbName)
        const usecase = new AddMochiUseCase(repository)

        const result = await usecase.run(person, +count)
        if (result.status !== 'ok') {
            throw result.error
        }

        const speechText = `Added ${count} mochi to ${result.result?.person}. ${result.result?.person} has ${result.result?.mochiCount} mochi.`;
        console.log(speechText)

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Add mochi', speechText)
            .getResponse();
    },
};

const RemoveMochiIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'RemoveMochiIntent';
    },
    async handle(handlerInput: HandlerInput): Promise<Response> {
        const request = handlerInput.requestEnvelope.request as IntentRequest
        const person = request.intent.slots?.['person'].value
        const count = request.intent.slots?.['count'].value
        if (person === undefined || count === undefined) {
            throw new Error(`Invalid slot: person: ${person}, count: ${count}`)
        }

        const ddb = new DynamoDBClient({})
        const client = DynamoDBDocumentClient.from(ddb)
        const dynamodbName = process.env.DYNAMODB_TABLE_NAME
        if (dynamodbName === undefined) {
            throw new Error('Invalid environment variable')
        }
        const repository = new MochiCountRepositoryImpl(client, dynamodbName)
        const usecase = new RemoveMochiUseCase(repository)

        const result = await usecase.run(person, +count)
        if (result.status !== 'ok') {
            throw result.error
        }

        const speechText = `Remove ${count} mochi from ${result.result?.person}. ${result.result?.person} has ${result.result?.mochiCount} mochi.`;
        console.log(speechText)

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Remove mochi', speechText)
            .getResponse();
    },
};

const HelpIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = 'Tell me like "Add two mochi to Taro".';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('How to use', speechText)
            .getResponse();
    },
};

const CancelAndStopIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent'
                || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = 'Bye.';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Bye.', speechText)
            .withShouldEndSession(true)
            .getResponse();
    },
};

const ErrorHandler: ErrorHandler = {
    canHandle(handlerInput: HandlerInput, error: Error): boolean {
        return true;
    },
    handle(handlerInput: HandlerInput, error: Error): Response {
        console.log(error.message);
        console.log(error.stack)

        const speechText = 'Something bad occured. Please tell me again.'

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('ERROR', speechText)
            .getResponse();
    }
};

exports.handler = SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AddMochiIntentHandler,
        RemoveMochiIntentHandler,
        CancelAndStopIntentHandler,
        HelpIntentHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
