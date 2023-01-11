import { config } from "../config/config";
import { LanguageCode, Topic } from "./03-ports/output/types";
import { Lambda, Request } from "./04-adapters/primary/LambdaAdapter";

let request: Request = {
    queryStringParameters: {
        [config.captcha.tokenKey]: "token",
        topic: Topic.ENTREPRENEURSHIP,
        language: LanguageCode.EN,
        postCount: "1",
    },
};

Lambda.handler(request).then(console.log);