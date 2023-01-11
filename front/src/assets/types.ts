import { Topic, LanguageCode } from "./backend";

export { Topic, LanguageCode };

export const topics = [
  {value: Topic.ENTREPRENEURSHIP, label: "Entrepreneurship (default)", selected: false},
  {value: Topic.CAREER, label: "Career", selected: false},
];

export const languages = [
  {value: LanguageCode.EN, label: "English", selected: false},
];
  