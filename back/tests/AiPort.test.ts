import axios from "axios";
import { AiPortFactory } from "../app/03-ports/output/AiPort";
import { LanguageCode, Topic } from "../app/03-ports/output/types";
import { OpenAiAdapter } from "../app/04-adapters/secondary/OpenAiAdapter";


/**
 * @description mock axios
 */
jest.mock('axios');
axios.post = jest.fn();

describe("AiPort :", () => {

    test("AiPortFactory", async () => {
        const ai = AiPortFactory();
        const result = new OpenAiAdapter();

        expect(ai).toStrictEqual(result);
    });

    test("OpenAiAdapter", async () => {
        const result = "awesome post";
        (axios.post as jest.Mock).mockResolvedValueOnce({data: {choices: [{text: result}]}});
        const ai = new OpenAiAdapter();

        expect(await ai.getPost(Topic.ENTREPRENEURSHIP, LanguageCode.EN)).toStrictEqual(result);
    });
    
});
