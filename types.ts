import * as coda from "@codahq/packs-sdk";

export type QuestionsResponse = SeResponse<Question>
export type TagsResponse = SeResponse<Tag>
export type TagSynonymsResponse = SeResponse<TagSynonym>
export type UserResponse = SeResponse<User>

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
  favorited: boolean;
  body_markdown?: string;
  is_answered: boolean; 
}

export interface Tag {
  has_synonyms: boolean;
  count: number;
  name: string;
}

export interface TagSynonym {
  creation_date: number;
  last_applied_date: number;
  applied_count: number;
  to_tag: string;
  from_tag: string;
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

export const enum SearchType {
  EntireSite = "All stackoverflow",
  MyBookmarks = "My bookmarks"
}

export interface User {
  reputation: number;
  link: string;
  profile_image: string;
  display_name: string;
}