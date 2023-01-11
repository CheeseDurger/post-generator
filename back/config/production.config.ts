import { secrets } from "./production.secrets";

export const config = {
    captcha: {
        tokenKey: "captcha",
        url: "https://www.google.com/recaptcha/api/siteverify",
        secretKey: secrets.captcha.secretKey,
    },
    openai: {
        completionEndpoint: "https://api.openai.com/v1/completions",
        entrepreneurship: {
            apiKey: secrets.openai.entrepreneurship.apiKey,
            model: "text-davinci-003",
            prompt: secrets.openai.entrepreneurship.prompt,
            maxTokens: 2048,
            temperature: 1,
            top_p: 1,
            completionStop: ["\n###\n"],
        },
        career: {
            apiKey: secrets.openai.career.apiKey,
            model: "text-davinci-003",
            prompt: secrets.openai.career.prompt,
            maxTokens: 2048,
            temperature: 1,
            top_p: 1,
            completionStop: ["\n###\n"],
        },
    },
    dynamodb: {
        table: "production_posts",
        region: "eu-west-3",
    },
};

