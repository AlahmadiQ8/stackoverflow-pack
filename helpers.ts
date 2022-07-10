import * as coda from "@codahq/packs-sdk";
import * as constants from './constants';
import { QuestionsResponse, SeContinuation, SeFilterQueryParameters, TagsResponse } from "./types";

/**
 * Mandatory query params to all api requests
 */
const commonQueryParams = {
  filter: constants.filter,
  site: 'stackoverflow',
  key: constants.seKey,
}

/**
 * Fetch questions given certain filters
 */
export async function getQuestions({fromDate, toDate, tags, page}: SeFilterQueryParameters, context: coda.SyncExecutionContext, includeQuestionBody: boolean = false) {
  const url = coda.withQueryParams('https://api.stackexchange.com/2.2/questions', {
    ...commonQueryParams, 
    ...(includeQuestionBody && { filter: constants.filterWithQuestionBody }),
    page, 
    pagesize: constants.defaultPageSize,
    ...(fromDate && { fromDate: toEpochTime(fromDate) }),
    ...(toDate && { toDate: toEpochTime(toDate) }),
    ...(tags && { tagged: tags }),
  });

  let response = await context.fetcher.fetch<QuestionsResponse>({
    method: 'GET',
    url
  });

  return response;
}

/**
 *  Fetches question given a url
 */
export async function getQuestion([url]: [string], context: coda.ExecutionContext) {
  const { id } = parseQuestionUrl(url);
  const response = await context.fetcher.fetch<QuestionsResponse>({
    method: 'GET',
    url: coda.withQueryParams(`https://api.stackexchange.com/2.2/questions/${id}`, commonQueryParams)
  });

  return response.body.items[0];
}

/**
 * Get current user's favorite tags
 */
export async function getUserTags(context: coda.ExecutionContext, continuation?: SeContinuation) {
  const nextPage = continuation?.currentPage ? continuation.currentPage + 1 : 1;
  const response = await context.fetcher.fetch<TagsResponse>({
    method: "GET",
    url: coda.withQueryParams('https://api.stackexchange.com/2.2/me/tags', {...commonQueryParams, page: nextPage})
  });

  return {
    result: response.body.items,
    continuation: {
      currentPage: nextPage,
      hasMore: Number(response.body.has_more)
    }
  }
}

/**
 * fetchs tags given certain search term
 */
export async function getTags(search: string, context: coda.ExecutionContext, continuation?: SeContinuation, pageSize: number = constants.defaultPageSize) {
  const nextPage = continuation?.currentPage ? continuation.currentPage + 1 : 1;
  const response = await context.fetcher.fetch<TagsResponse>({
    method: "GET",
    url: coda.withQueryParams('https://api.stackexchange.com/2.2/tags', {
      ...commonQueryParams,
      sort: 'popular',
      order: 'desc', 
      page: nextPage,
      pagesize: pageSize,
      inname: search
    })
  });

  return {
    result: response.body.items,
    continuation: {
      currentPage: nextPage,
      hasMore: Number(response.body.has_more)
    }
  }
}

/**
 * returns date with number of days added or subtracted from it
 */
export function addOrSubstractDays(startingDate: Date, numberOfDays: number) {
  return new Date(new Date().setDate(startingDate.getDate() + numberOfDays));
}

/**
 * extracts question id from stackoverflow url
 * @param url stackoverflow url
 * @returns object containing question id
 */
function parseQuestionUrl(url: string): { id: string } {
  let match = url.match(constants.questionUrlRegex);
  if (!match) {
    throw new coda.UserVisibleError("Invalid question URL: " + url);
  }
  return {
    id: match[1],
  };
}

/**
 * returns epoch time of a given date
 * @example
 * toEpochTime(new Date('2022-07-05')) // returns 1656979200
 */
function toEpochTime(date: Date): number {
  return Math.floor(date.getTime() / 1000);
} 