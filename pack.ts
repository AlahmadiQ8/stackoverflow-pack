import * as coda from "@codahq/packs-sdk";
import { bookmarkQuestion, getQuestion, getQuestions, undoBookmarkQuestion } from "./helpers";
import { questionSchema } from "./schemas";
import * as constants from './constants';
import { anotherTagsParameter, dateRange, includeQuestionBody, tagsParameter } from "./parameters";

export const pack = coda.newPack();

pack.addNetworkDomain("stackexchange.com");

// Setup per-user authentication using Stackoverflow's OAuth2.
// Remember to set your client ID and secret in the "Settings" tab.
// See https://api.stackexchange.com/docs/authentication
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://stackoverflow.com/oauth",
  tokenUrl: "https://stackoverflow.com/oauth/access_token/json",
  scopes: ["read_inbox", "no_expiry", "private_info"],
  tokenQueryParam: "access_token", 
});

// Adds Formula to  get information about a single question via url
pack.addFormula({
  name: "Question",
  description: "Get information about a question from it's URL.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "url",
      description: "The url of the question",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: questionSchema,
  execute: getQuestion
});

// Column format for Question formula
pack.addColumnFormat({
  name: 'Question',
  instructions: 'Show details about a stackoverflow question, given a URL',
  formulaName: 'Question',
  matchers: [
    constants.questionUrlRegex
  ]
});

// Action to bookmark a question
pack.addFormula({
  name: 'BookmarkQuestion',
  description: 'Bookmark (previously known as favorite) given question url to your account.',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "url",
      description: "The url of the question",
    }),
  ],
  isAction: true,
  resultType: coda.ValueType.Object,
  schema: coda.withIdentity(questionSchema, 'Question'),
  // schema: {...questionSchema, identity: { name: "Question", packId: 12829 }},
  extraOAuthScopes: ['write_access'],
  execute: bookmarkQuestion
});

// Action to remove question from bookmarks
pack.addFormula({
  name: 'UndoBookmarkQuestion',
  description: 'Undo bookmark (previously known as favorite) for a given question url.',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "url",
      description: "The url of the question",
    }),
  ],
  isAction: true,
  resultType: coda.ValueType.Object,
  schema: coda.withIdentity(questionSchema, 'Question'),
  // schema: {...questionSchema, identity: { name: "Question", packId: 12829 }},
  extraOAuthScopes: ['write_access'],
  execute: undoBookmarkQuestion
});

// Adds sync table to get all questions. Better to use filters to limit results
pack.addSyncTable({
  name: "Questions",
  schema: questionSchema,
  identityName: "Question",
  formula: {
    name: "SyncQuestions",
    description: "Sync Questions",
    parameters: [
      dateRange,
      includeQuestionBody,
      tagsParameter,
      anotherTagsParameter
    ],
    execute: async ([dateRange, includeMarkdownBody, tag, anotherTag], context) => {
      let page = (context.sync.continuation?.page as number) || 1;
      const tagsFilter = [tag, anotherTag].join(';');
      let response = await getQuestions({fromDate: dateRange[0], toDate: dateRange[1], tags: tagsFilter, page}, context, includeMarkdownBody);
      const questions = response.body.items;
      let continuation;
      if (response.body.has_more) {
        continuation = { page: page + 1 };
      }

      return {
        result: questions,
        continuation
      }
    } 
  }
});
