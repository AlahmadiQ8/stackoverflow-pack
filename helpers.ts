import * as coda from "@codahq/packs-sdk";
import * as constants from './constants';
import { QuestionsResponse, SeContinuation, SeFilterQueryParameters, TagsResponse } from "./types";

/**
 * Mandatory query params to all api requests
 */
const commonParams = {
  filter: constants.filter,
  site: 'stackoverflow',
  key: constants.seKey,
}

/**
 * Fetch questions given certain filters
 */
export async function getQuestions({fromDate, toDate, tags, page}: SeFilterQueryParameters, context: coda.SyncExecutionContext, includeQuestionBody: boolean = false) {
  const url = coda.withQueryParams('https://api.stackexchange.com/2.2/questions', {
    ...commonParams, 
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
    url: coda.withQueryParams(`https://api.stackexchange.com/2.2/questions/${id}`, commonParams)
  });

  return response.body.items[0];
}

/**
 * Boomarks a given question via url
 */
export async function bookmarkQuestion([url], context: coda.ExecutionContext) {
  const { id } = parseQuestionUrl(url);

  let response;
  try {
    response = await context.fetcher.fetch<QuestionsResponse>({
      method: 'POST',
      url: `https://api.stackexchange.com/2.3/questions/${id}/favorite`,
      // We have to do this to bypass TS type checking https://stackoverflow.com/a/67219058/5431968
      form: commonParams
    });
  } catch (error) {
    ensureNoneErrorStatusCode(error);
  }

  const question = response.body.items[0]; 

  // Reponse doesn't include question_id which is required to sync table row. 
  // this is because we set the idProperty in QuestionSchema to question_id.
  return {...question, question_id: id};
}

/**
 * Remove boomark a given question via url
 */
export async function undoBookmarkQuestion([url], context: coda.ExecutionContext) {
  const { id } = parseQuestionUrl(url);

  let response;
  try {
    response = await context.fetcher.fetch<QuestionsResponse>({
      method: 'POST',
      url: `https://api.stackexchange.com/2.3/questions/${id}/favorite/undo`,
      // We have to do this to bypass TS type checking https://stackoverflow.com/a/67219058/5431968
      form: commonParams
    });
  } catch (error) {
    ensureNoneErrorStatusCode(error);
  }

  const question = response.body.items[0]; 

  // Reponse doesn't include question_id which is required to sync table row.
  // this is because we set the idProperty in QuestionSchema to question_id.
  return {...question, question_id: id};
}

/**
 * Get current user's favorite tags
 */
export async function getUserTags(context: coda.ExecutionContext, continuation?: SeContinuation) {
  const nextPage = continuation?.currentPage ? continuation.currentPage + 1 : 1;
  const response = await context.fetcher.fetch<TagsResponse>({
    method: "GET",
    url: coda.withQueryParams('https://api.stackexchange.com/2.2/me/tags', {...commonParams, page: nextPage})
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
      ...commonParams,
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

/**
 * Throw user friendly error if given error is a result of status code >= 400
 */
function ensureNoneErrorStatusCode(error: any): void { 
  if (error.statusCode >= 400) {
    const statusError = error as coda.StatusCodeError;
    const messageName = statusError.body?.error_name;
    const message = statusError.body?.error_message;
    throw new coda.UserVisibleError(`${messageName}: ${message}`);
  }
}