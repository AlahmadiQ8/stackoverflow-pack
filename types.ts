import * as coda from "@codahq/packs-sdk";

export type QuestionsResponse = SeResponse<Question>
export type TagsResponse = SeResponse<Tag>

interface SeResponse<T> {
  items: T[];
  has_more: boolean;
}

export interface Question {
  tags: string[];
  view_count: number;
  answer_count: number;
  score: number;
  last_activity_date: number;
  creation_date: number;
  question_id: number;
  link: string;
  title: string;
}

export interface Tag {
  has_synonyms: boolean;
  count: number;
  name: string;
}

export interface SeContinuation extends coda.Continuation {
  currentPage: number,
  hasMore: number,
}

export interface SeFilterQueryParameters {
  fromDate?: Date,
  toDate?: Date,
  tags?: string,
  page: number,
}