export enum LanguageCode {
    EN = "en",
}

export enum Topic {
    ENTREPRENEURSHIP = "entrepreneurship",
    CAREER = "career",
}

export class Post {
    constructor(
        public readonly topic: Topic,
        public readonly timestamp: Date,
        public readonly language: LanguageCode,
        public readonly postCount: number,
        public readonly text: string,
    ) {}
}

