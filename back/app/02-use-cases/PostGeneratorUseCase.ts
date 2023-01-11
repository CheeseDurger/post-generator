import { AiPort, AiPortFactory } from "../03-ports/output/AiPort";
import { Topic, LanguageCode, Post } from "../03-ports/output/types";
import { DbPort, DbPortFactory } from "../03-ports/output/DbPort";
import { CaptchaPort, CaptchaPortFactory } from "../03-ports/output/CaptchaPort";

/**
 * @classdesc use case to generate social media posts
 */
export class PostGeneratorUseCase {

    /**
     * Generates a text for a social media post
     * @param topic topic from which the post will be generated
     * @param language langage from which the post will be generated
     * @param token captcha token that will be verified
     * @returns the text to be displayed to the final user (eg. text of the social media post,
     * of text of the error to be shown to the final user)
     * 
     * @throws an error if :
     * - Captcha bad token
     * - Captcha validation error
     * - Ai post generation error
     */
    async handle(token: string, topic: Topic, language: LanguageCode, postCount: number): Promise<string> {

        // Verify captcha or throws
        let isValid: boolean;
        try {
            const validator: CaptchaPort = CaptchaPortFactory();
            isValid = await validator.isValid(token);
        } catch (error) {
            console.error("Captcha validation error :\n", (error as Error).message);
            throw error;
        }
        if (!isValid) {
            console.error("Captcha bad token",);
            throw new Error("Captcha bad token");
        }

        // Get Ai post or throws
        let text: string;
        try {
            const ai: AiPort = AiPortFactory();
            text = await ai.getPost(topic, language);
        } catch (error) {
            console.error("Ai post generation error :\n", (error as Error).message);
            throw error;
        }

        // Save Ai post or throws
        try {
	        const db: DbPort = DbPortFactory();
	        const post = new Post(
	            Topic.ENTREPRENEURSHIP,
	            new Date(),
	            LanguageCode.EN,
                postCount,
	            text,
	        );
	        await db.save(post); // We want to save the post asynchronously (=> no await), and we don't manage here the case where save() fails
        } catch (error) {
            console.error("Db save error :\n", (error as Error).message);
        }

        return text;

    }
}