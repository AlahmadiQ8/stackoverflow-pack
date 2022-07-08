import * as coda from "@codahq/packs-sdk";
import * as constants from './constants';
import { QuestionResponse, SeResponse } from "./types";

const commonQueryParams = {
  filter: constants.filter,
  site: 'stackoverflow',
  key: constants.seKey,
}

/**
 *  Fetches question given a url
 */
export async function getQuestion([url]: [string], context: coda.ExecutionContext) {
  const { id } = parseQuestionUrl(url);
  const response = await context.fetcher.fetch<SeResponse<QuestionResponse>>({
    method: 'GET',
    url: coda.withQueryParams(`https://api.stackexchange.com/2.2/questions/${id}`, commonQueryParams)
  });

  return response.body.items[0];
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