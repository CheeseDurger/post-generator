import { DbPortFactory } from "../app/03-ports/output/DbPort";
import { DynamoDbAdapter } from "../app/04-adapters/secondary/DynamoDbAdapter"
import { LanguageCode, Post, Topic } from "../app/03-ports/output/types";


/**
 * @description mock aws-sdk
 */
const put = jest.fn( () => {
    return {
        promise: jest.fn( async () => {}),
    };
});
jest.mock("aws-sdk", () => {
    return {
        DynamoDB: {
            DocumentClient: jest.fn(() => {
                return {
                    put: put,
                };
            }),
        },
    };
});


describe("DbPort :", () => {

    afterEach( () => {
        jest.clearAllMocks();
    });

    test("DbPortFactory", async () => {
        const db = DbPortFactory();
        const result = new DynamoDbAdapter();

        expect(db).toStrictEqual(result);
    });

    test("DynamoDbAdapter: save", async () => {
        const post = new Post(Topic.ENTREPRENEURSHIP, new Date(), LanguageCode.EN, 1, "awesome post");
        const db = new DynamoDbAdapter();
        await db.save(post);

        expect(put).toHaveBeenCalledTimes(1);
    });
    
});
