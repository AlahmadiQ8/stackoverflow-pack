import * as coda from "@codahq/packs-sdk";
import * as constants from './constants';
import { QuestionsResponse, SearchType, SeContinuation, SeFilterQueryParameters, TagsResponse, TagSynonymsResponse } from "./types";

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
export async function getQuestions({fromDate, toDate, tags, page}: SeFilterQueryParameters, searchType: SearchType, context: coda.SyncExecutionContext, includeQuestionBody: boolean = false) {
  const endpoint = searchType == SearchType.EntireSite
    ? 'https://api.stackexchange.com/2.2/questions'
    : 'https://api.stackexchange.com/2.2/me/favorites'
  const url = coda.withQueryParams(endpoint, {
    ...commonParams, 
    ...(includeQuestionBody && { filter: constants.filterWithQuestionBody }),
    page, 
    pagesize: constants.defaultPageSize,
    // When user selects "Everything" in the Date Range parameter, we should not include fromdate & todate otherwise we'd get 400 error
    ...(toEpochTime(fromDate) > -62135608012 && { fromDate: toEpochTime(fromDate) }),
    ...(toEpochTime(toDate) < 64060577999 && { toDate: toEpochTime(toDate) }),
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

  let response: coda.FetchResponse;
  try {
    response = await context.fetcher.fetch<QuestionsResponse>({
      method: 'POST',
      url: `https://api.stackexchange.com/2.3/questions/${id}/favorite`,
      // We have to do this to bypass TS type checking https://stackoverflow.com/a/67219058/5431968
      form: commonParams
    });
  } catch (error) {
    ensureNoneErrorStatusCode(error);
    throw error;
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

  let response: coda.FetchResponse;
  try {
    response = await context.fetcher.fetch<QuestionsResponse>({
      method: 'POST',
      url: `https://api.stackexchange.com/2.3/questions/${id}/favorite/undo`,
      // We have to do this to bypass TS type checking https://stackoverflow.com/a/67219058/5431968
      form: commonParams
    });
  } catch (error) {
    ensureNoneErrorStatusCode(error);
    throw error;
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
  
  let response: coda.FetchResponse<TagsResponse>;
  try {
    response = await context.fetcher.fetch<TagsResponse>({
      method: "GET",
      url: coda.withQueryParams('https://api.stackexchange.com/2.2/me/tags', {...commonParams, page: nextPage, pagesize: constants.defaultPageSize})
    });
  } catch(error) {
    ensureNoneErrorStatusCode(error);
    throw error;
  }

  return {
    result: response.body.items,
    continuation: {
      currentPage: nextPage,
      hasMore: Number(response.body.has_more)
    }
  }
}

/**
 * Get tag synonyms
 */
export async function getTagSynonyms(tag: string, context: coda.ExecutionContext, continuation?: SeContinuation) {
  const nextPage = continuation?.currentPage ? continuation.currentPage + 1 : 1;
  const { filter,  ...params } = commonParams; // don't use filter param in this api call
  
  let response: coda.FetchResponse<TagSynonymsResponse>;
  try {
    response = await context.fetcher.fetch<TagSynonymsResponse>({
      method: "GET",
      url: coda.withQueryParams(`https://api.stackexchange.com/2.2/tags/${tag}/synonyms`, {...params, page: nextPage, pagesize: constants.defaultPageSize})
    });
  } catch(error) {
    ensureNoneErrorStatusCode(error);
    throw error;
  }

  return {
    result: response.body.items,
    continuation: {
      currentPage: nextPage,
      hasMore: Number(response.body.has_more)
    }
  }
}

/**
 * Get tag info
 */
 export async function getTagInfo(tag: string, context: coda.ExecutionContext, continuation?: SeContinuation) {
  const nextPage = continuation?.currentPage ? continuation.currentPage + 1 : 1;
  
  let response: coda.FetchResponse<TagsResponse>;
  try {
    response = await context.fetcher.fetch<TagsResponse>({
      method: "GET",
      url: coda.withQueryParams(`https://api.stackexchange.com/2.2/tags/${tag}/info`, {...commonParams, page: nextPage, pagesize: constants.defaultPageSize})
    });
  } catch(error) {
    ensureNoneErrorStatusCode(error);
    throw error;
  }

  return {
    result: response.body.items,
    continuation: {
      currentPage: nextPage,
      hasMore: Number(response.body.has_more)
    }
  }
}

/**
 * Get related tags
 */
export async function getRelatedTags(tags: string[], context: coda.ExecutionContext, continuation?: SeContinuation, pageSize: number = constants.defaultPageSize) {
  const nextPage = continuation?.currentPage ? continuation.currentPage + 1 : 1;
  
  let response: coda.FetchResponse<TagsResponse>;
  try {
    response = await context.fetcher.fetch<TagsResponse>({
      method: "GET",
      url: coda.withQueryParams(`https://api.stackexchange.com/2.2/tags/${tags.join(';')}/related`, {...commonParams, page: nextPage, pagesize: pageSize})
    });
  } catch(error) {
    ensureNoneErrorStatusCode(error);
    throw error;
  }

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

  let response: coda.FetchResponse;
  try {
    response = await context.fetcher.fetch<TagsResponse>({
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
  } catch (error) {
    ensureNoneErrorStatusCode(error)
    throw error;
  }

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