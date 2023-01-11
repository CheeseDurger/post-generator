// Duplicate this file to staging.secrets.ts and production.secrets.ts,
// and fill it with the good values.
// Those files are imported only once, in a config.ts file created by the pipeline
export const secrets = {
    recaptcha: {
        secretKey: "your recaptcha v3 secret key",
    },
    openai: {
        apiKey: "your openai api key",
        entrepreneurship: {
            apiKey: "your openai api key",
            prompt: "your entrepreneurship prompt",
        },
        career: {
            apiKey: "your openai api key",
            prompt: "your career prompt",
        },
    },
}