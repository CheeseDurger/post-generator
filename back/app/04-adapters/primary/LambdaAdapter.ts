import { Topic, LanguageCode } from "../../03-ports/output/types";
import { PostGeneratorUseCase } from "../../02-use-cases/PostGeneratorUseCase";
import { config } from "../../../config/config";

/**
 * @classdesc class containing the handler method for the lambda function
 * 
 * @see `exports.handler` at the end of this file
 */
export class Lambda {
    static async handler(request: Request): Promise<Response> {
        console.log("Request received :\n", request);

        const token: string = Lambda.sanitizeCaptcha(request?.queryStringParameters?.[config.captcha.tokenKey]);
        const topic: Topic = Lambda.sanitizeTopic(request?.queryStringParameters?.topic);
        const language: LanguageCode = Lambda.sanitizeLanguage(request?.queryStringParameters?.language);
        const postCount: number = Lambda.sanitizePostCount( parseInt(request?.queryStringParameters?.postCount) );

        const postGenerator = new PostGeneratorUseCase();

        try {
            const postContent = await postGenerator.handle(token, topic, language, postCount);
            return new Response(200, postContent);
        } catch (error: unknown) {
            return new Response(500, "error");
        }
        
    }

    private static sanitizeCaptcha(token: any): string {
        if (typeof token === "string") return token;
        else return "";
    }

    private static sanitizeTopic(topic: any): Topic {
        if (Object.values(Topic).includes(topic)) return topic;
        else return Topic.ENTREPRENEURSHIP;
    }

    private static sanitizeLanguage(language: any): LanguageCode {
        if (Object.values(LanguageCode).includes(language)) return language;
        else return LanguageCode.EN;
    }

    private static sanitizePostCount(postCount: any): number {
        if (typeof postCount === "number" && postCount > 0) return postCount;
        else return 1;
    }
}

/**
 * @classdesc An http response issued by Lambda
 */
export class Response {
    public readonly statusCode: number;
    public readonly body: string;

    /**
     * Constructor
     * @param statusCode http status code (eg. 200, 404, etc.)
     * @param message text that is returned in the http response body
     */
    constructor(statusCode: number, message: string) {
        this.statusCode = statusCode;
        this.body = message;
    }
}

/**
 * @classdesc An http request sent to Lambda
 */
export interface Request {
    queryStringParameters: {
        [captchaKey: string]: string,
        topic: Topic,
        language: LanguageCode,
        postCount: string,
    }
}
