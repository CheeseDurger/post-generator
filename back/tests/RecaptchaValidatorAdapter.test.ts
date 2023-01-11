import axios from "axios";
import { CaptchaPortFactory } from "../app/03-ports/output/CaptchaPort";
import { LanguageCode, Topic } from "../app/03-ports/output/types";
import { RecaptchaValidatorAdapter } from "../app/04-adapters/secondary/RecaptchaValidatorAdapter";


/**
 * @description mock axios
 */
jest.mock('axios');
axios.post = jest.fn();

describe("CaptchaPort :", () => {

    test("CaptchaPortFactory", async () => {
        const captchaValidator = CaptchaPortFactory();
        const result = new RecaptchaValidatorAdapter();

        expect(captchaValidator).toStrictEqual(result);
    });

    test("RecaptchaValidatorAdapter: isValid true", async () => {
        (axios.post as jest.Mock).mockResolvedValueOnce({data: {success: true}});
        const captchaValidator = new RecaptchaValidatorAdapter();

        expect(await captchaValidator.isValid("token")).toStrictEqual(true);
    });

    test("RecaptchaValidatorAdapter: isValid false", async () => {
        (axios.post as jest.Mock).mockResolvedValueOnce({data: {success: false}});
        const captchaValidator = new RecaptchaValidatorAdapter();

        expect(await captchaValidator.isValid("token")).toStrictEqual(false);
    });
    
});
