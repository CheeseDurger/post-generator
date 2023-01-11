import axios from "axios";
import querystring from "node:querystring";

import { config } from "../../../config/config";
import { CaptchaPort } from "../../03-ports/output/CaptchaPort";

export class RecaptchaValidatorAdapter implements CaptchaPort {

    async isValid(token: string): Promise<boolean> {
        const response = await axios.post(
            config.captcha.url,
            querystring.stringify({
                secret: config.captcha.secretKey,
                response: token,
            })
        );
        if (!response.data.success) {
            // If the recaptcha check fails
            console.log("Recaptcha user failure :", JSON.stringify(response.data["error-codes"]));
            return false;
        } else return true;
    }
}
