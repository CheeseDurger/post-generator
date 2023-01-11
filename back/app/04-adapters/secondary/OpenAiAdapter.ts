import axios from "axios";

import { config } from "../../../config/config";
import { Topic, LanguageCode } from "../../03-ports/output/types";
import { AiPort } from "../../03-ports/output/AiPort";

export class OpenAiAdapter implements AiPort {

    async getPost(topic: Topic, language: LanguageCode): Promise<string> {
        const result = await axios.post(
            config.openai.completionEndpoint,
            {
                model: config.openai[topic].model,
                prompt: config.openai[topic].prompt,
                max_tokens: config.openai[topic].maxTokens,
                temperature: config.openai[topic].temperature,
                top_p: config.openai[topic].top_p,
                stop: config.openai[topic].completionStop,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + config.openai[topic].apiKey,
                },
            }
        );
        console.log("Response retrieved from Openai :\n", result.data);

        let post: string = result.data.choices[0].text;
        post = this.removeTrailingCharacters(post);
        return post;
    }

    /**
     * Removes useless characters from the beginning of a post
     * 
     * @description Somesimes OpenAI adds newlines at the beginning of a post. This function removes it.
     * 
     * @param post to be trimmed
     * @returns text without trailing newlines or spaces
     */
    private removeTrailingCharacters(post: string): string {
        return post.replace(/^\s+/g, '');
    }
}
