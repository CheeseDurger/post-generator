import { Post } from "./types";
import { DynamoDbAdapter } from "../../04-adapters/secondary/DynamoDbAdapter"

export interface DbPort {
    /**
     * Saves a post to the database
     * @param post post to be saved
     */
    save(post: Post): Promise<void>;
}

/**
 * Get the default db adapter
 * @returns an instance of the default db adapter
 */
export function DbPortFactory(): DbPort {
    return new DynamoDbAdapter();
}