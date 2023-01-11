import { RecaptchaValidatorAdapter } from "../../04-adapters/secondary/RecaptchaValidatorAdapter";

export interface CaptchaPort {
    /**
     * Checks if the captcha token is valid
     * @param {string} token - catpcha token to validate
     * @returns {Promise<boolean>} true if the captcha token is valid
     */
    isValid(token: string): Promise<boolean>;
}

/**
 * Get the default captcha adapter
 * @returns an instance of the default captcha adapter
 */
export function CaptchaPortFactory(): CaptchaPort {
    return new RecaptchaValidatorAdapter();
}