import { DynamoDB } from "aws-sdk";

import { config } from "../../../config/config";
import { Post } from "../../03-ports/output/types";

export class DynamoDbAdapter {
    private readonly documentClient: DynamoDB.DocumentClient = new DynamoDB.DocumentClient({ region: config.dynamodb.region });

    async save(post: Post): Promise<void> {
        const parameters = {
            Item: {
                "topic": post.topic,
                "timestamp": post.timestamp.toISOString(),
                "language": post.language,
                "postCount": post.postCount,
                "text": post.text,
            },
            TableName: config.dynamodb.table,
        };
        await this.documentClient.put(parameters).promise();
    }
}
