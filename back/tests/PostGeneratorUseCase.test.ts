import { expect, jest, test } from '@jest/globals';
import { PostGeneratorUseCase } from '../app/02-use-cases/PostGeneratorUseCase';
import { LanguageCode, Topic } from '../app/03-ports/output/types';


const isValid = jest.fn(async () => true);
jest.mock("../app/03-ports/output/CaptchaPort", () => {
    return {
        CaptchaPortFactory: jest.fn(() => {
            return {
                isValid: isValid,
            };
        }),
    };
});

const postContent = "My awesome post";
const getPost = jest.fn(async () => postContent);
jest.mock("../app/03-ports/output/AiPort", () => {
    return {
        AiPortFactory: jest.fn(() => {
            return {
                getPost: getPost,
            };
        }),
    };
});

const save = jest.fn(async () => { });
jest.mock("../app/03-ports/output/DbPort", () => {
    return {
        DbPortFactory: jest.fn(() => {
            return {
                save: save,
            };
        }),
    };
});


describe("PostGeneratorUseCase :", () => {

    test("handle: standard", async () => {
        const postGenerator = new PostGeneratorUseCase();
        const response = await postGenerator.handle("token", Topic.ENTREPRENEURSHIP, LanguageCode.EN, 1);
        expect(response).toBe(postContent);
    });

    describe("handler errors :", () => {

        test("handle: bad captcha", async () => {
            isValid.mockResolvedValueOnce(false);
            const postGenerator = new PostGeneratorUseCase();
            expect(async () => { await postGenerator.handle("token", Topic.ENTREPRENEURSHIP, LanguageCode.EN, 1) })
                .rejects.toThrow();
        });

        test("handle: captcha error", async () => {
            isValid.mockRejectedValueOnce(new Error());
            const postGenerator = new PostGeneratorUseCase();
            expect(async () => { await postGenerator.handle("token", Topic.ENTREPRENEURSHIP, LanguageCode.EN, 1) })
                .rejects.toThrow();
        });

        test("handle: ai error", async () => {
            getPost.mockRejectedValueOnce(new Error());
            const postGenerator = new PostGeneratorUseCase();
            expect(async () => { await postGenerator.handle("token", Topic.ENTREPRENEURSHIP, LanguageCode.EN, 1) })
                .rejects.toThrow();
        });

        test("handle: db error", async () => {
            save.mockRejectedValueOnce(new Error("Db"));
            const postGenerator = new PostGeneratorUseCase();
            const response = await postGenerator.handle("token", Topic.ENTREPRENEURSHIP, LanguageCode.EN, 1);
            expect(response).toBe(postContent);
            expect(save.mock.results[save.mock.results.length - 1].value).rejects.toMatchObject({ message: "Db" });
        });
    });

});
