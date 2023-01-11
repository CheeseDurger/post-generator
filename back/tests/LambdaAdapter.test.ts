import { expect, jest, test } from '@jest/globals';
import { LanguageCode, Topic } from '../app/03-ports/output/types';
import { Lambda, Request, Response } from "../app/04-adapters/primary/LambdaAdapter";
import { config } from "../config/config";


const postContent = "My awesome post";
const handle = jest.fn(async () => postContent);
jest.mock("../app/02-use-cases/PostGeneratorUseCase", () => {
    return {
        PostGeneratorUseCase: jest.fn(() => {
            return {
                handle: handle,
            };
        }),
    };
});


describe("Lambda :", () => {

    test("handler", async () => {
        const event: Request = {
            queryStringParameters: {
                [config.captcha.tokenKey]: "token",
                topic: Topic.CAREER,
                language: LanguageCode.EN,
                postCount: "1",
            },
        };

        const result = new Response(200, postContent);

        expect(await Lambda.handler(event)).toEqual(result);
        expect(handle.mock.lastCall).toEqual(["token", Topic.CAREER, LanguageCode.EN, 1]);
    });

    describe("handler sanitization :", () => {

        test("handler : sanitize captcha", async () => {

            await Lambda.handler({
                queryStringParameters: {
                    topic: Topic.ENTREPRENEURSHIP,
                    language: LanguageCode.EN,
                    postCount: "1",
                },
            });
            expect(handle.mock.lastCall).toEqual(["", Topic.ENTREPRENEURSHIP, LanguageCode.EN, 1]);

            await Lambda.handler({
                queryStringParameters: {
                    [config.captcha.tokenKey]: [1, 2] as any,
                    topic: Topic.ENTREPRENEURSHIP,
                    language: LanguageCode.EN,
                    postCount: "1",
                },
            });
            expect(handle.mock.lastCall).toEqual(["", Topic.ENTREPRENEURSHIP, LanguageCode.EN, 1]);
        });

        test("handler : sanitize topic", async () => {

            await Lambda.handler({
                queryStringParameters: {
                    [config.captcha.tokenKey]: "token",
                    language: LanguageCode.EN,
                    postCount: "1",
                },
            } as Request);
            expect(handle.mock.lastCall).toEqual(["token", Topic.ENTREPRENEURSHIP, LanguageCode.EN, 1]);

            await Lambda.handler({
                queryStringParameters: {
                    [config.captcha.tokenKey]: "token",
                    topic: [1, 2] as any,
                    language: LanguageCode.EN,
                    postCount: "1",
                },
            });
            expect(handle.mock.lastCall).toEqual(["token", Topic.ENTREPRENEURSHIP, LanguageCode.EN, 1]);

            await Lambda.handler({
                queryStringParameters: {
                    [config.captcha.tokenKey]: "token",
                    topic: "abcdefghi" as any,
                    language: LanguageCode.EN,
                    postCount: "1",
                },
            });
            expect(handle.mock.lastCall).toEqual(["token", Topic.ENTREPRENEURSHIP, LanguageCode.EN, 1]);
        });

        test("handler : sanitize language", async () => {
            await Lambda.handler({
                queryStringParameters: {
                    [config.captcha.tokenKey]: "token",
                    topic: Topic.ENTREPRENEURSHIP,
                    postCount: "1",
                },
            } as Request);
            expect(handle.mock.lastCall).toEqual(["token", Topic.ENTREPRENEURSHIP, LanguageCode.EN, 1]);

            await Lambda.handler({
                queryStringParameters: {
                    [config.captcha.tokenKey]: "token",
                    topic: Topic.ENTREPRENEURSHIP,
                    language: [1, 2] as any,
                    postCount: "1",
                },
            });
            expect(handle.mock.lastCall).toEqual(["token", Topic.ENTREPRENEURSHIP, LanguageCode.EN, 1]);

            await Lambda.handler({
                queryStringParameters: {
                    [config.captcha.tokenKey]: "token",
                    topic: Topic.ENTREPRENEURSHIP,
                    language: "abcdefghi" as any,
                    postCount: "1",
                },
            });
            expect(handle.mock.lastCall).toEqual(["token", Topic.ENTREPRENEURSHIP, LanguageCode.EN, 1]);
        });

    });

        test("handler : sanitize postCount", async () => {
            await Lambda.handler({
                queryStringParameters: {
                    [config.captcha.tokenKey]: "token",
                    topic: Topic.ENTREPRENEURSHIP,
                    language: LanguageCode.EN,
                },
            } as Request);
            expect(handle.mock.lastCall).toEqual(["token", Topic.ENTREPRENEURSHIP, LanguageCode.EN, 1]);

            await Lambda.handler({
                queryStringParameters: {
                    [config.captcha.tokenKey]: "token",
                    topic: Topic.ENTREPRENEURSHIP,
                    language: LanguageCode.EN,
                    postCount: "toto",
                },
            });
            expect(handle.mock.lastCall).toEqual(["token", Topic.ENTREPRENEURSHIP, LanguageCode.EN, 1]);

            await Lambda.handler({
                queryStringParameters: {
                    [config.captcha.tokenKey]: "token",
                    topic: Topic.ENTREPRENEURSHIP,
                    language: LanguageCode.EN,
                    postCount: [1, 2] as any,
                },
            });
            expect(handle.mock.lastCall).toEqual(["token", Topic.ENTREPRENEURSHIP, LanguageCode.EN, 1]);
        });

        test("handler : error", async () => {
            handle.mockRejectedValueOnce(new Error(""))
            const event: Request = {
                queryStringParameters: {
                    [config.captcha.tokenKey]: "token",
                    topic: Topic.ENTREPRENEURSHIP,
                    language: LanguageCode.EN,
                    postCount: "1",
                },
            };

            const result = new Response(500, "error");

            expect(await Lambda.handler(event)).toEqual(result);
        });

});
