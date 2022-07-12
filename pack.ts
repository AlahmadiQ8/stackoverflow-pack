import * as coda from "@codahq/packs-sdk";
import { bookmarkQuestion, getQuestion, getQuestions, getRelatedTags, getTagSynonyms, getUserTags, undoBookmarkQuestion } from "./helpers";
import { QuestionSchema } from "./schemas";
import * as constants from './constants';
import { dateRange, includeQuestionBody, tagsListParameter, tagParameter } from "./parameters";
import { SearchType, SeContinuation, Tag, TagSynonym } from "./types";

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
  schema: QuestionSchema,
  execute: getQuestion
});

pack.addFormula({
  name: "FindTags",
  description: "Type the first letters of a desired tags to see the most popular matching tags",
  parameters: [],
  varargParameters: [ tagParameter ],
  resultType: coda.ValueType.Array,
  items: { type: coda.ValueType.String },
  execute: ([...tags]) => {
    return tags as string[];
  },
})

pack.addFormula({
  name: "MyTags",
  description: 'Get the tags that the account have been active in.',
  parameters: [],
  resultType: coda.ValueType.Array,
  items: { type: coda.ValueType.String },
  execute: async (_, context) => {
    const result: Tag[] = [];
    let continuation: SeContinuation | undefined;
    do {
      let response = await getUserTags(context, continuation);
      result.push(...response.result);
      ({continuation} = response);
    } while (continuation?.hasMore)
    return result.map(r => r.name); 
  }
})

pack.addFormula({
  name: "TagSynonyms", 
  description: 'Gets all synonyms pointing to a given tag',
  parameters: [tagParameter],
  resultType: coda.ValueType.Array,
  items: { type: coda.ValueType.String},
  execute: async ([tag], context) => {
    const result:  TagSynonym[] = [];
    let continuation: SeContinuation | undefined;
    do {
      let response = await getTagSynonyms(tag, context,continuation);
      result.push(...response.result);
      ({continuation} = response);
    } while (continuation?.hasMore)

    return result.map(r => r.from_tag)
  }
})

pack.addFormula({
  name: "RelatedTags", 
  description: 'Returns the tags that are most related to given tag',
  parameters: [tagParameter],
  resultType: coda.ValueType.Array,
  items: { type: coda.ValueType.String},
  execute: async ([tag], context) => {
    const result:  Tag[] = [];
    let continuation: SeContinuation | undefined;
    do {
      let response = await getRelatedTags(tag, context,continuation);
      result.push(...response.result);
      ({continuation} = response);
    } while (continuation?.hasMore)

    return result.map(r => r.name)
  }
})

pack.addColumnFormat({
  name: 'Question',
  instructions: 'Show details about a stackoverflow question, given a URL',
  formulaName: 'Question',
  matchers: [
    constants.questionUrlRegex
  ]
});

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
  schema: coda.withIdentity(QuestionSchema, 'Question'),
  extraOAuthScopes: ['write_access'],
  execute: bookmarkQuestion
});

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
  schema: coda.withIdentity(QuestionSchema, 'Question'),
  extraOAuthScopes: ['write_access'],
  execute: undoBookmarkQuestion
});

pack.addSyncTable({
  name: "Questions",
  schema: QuestionSchema,
  identityName: "Question",
  formula: {
    name: "SyncQuestions",
    description: "Sync Questions",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: 'SearchType',
        description: 'Whether to SearchType entire questions on stackoverflow or only the current user\'s bookmarked questions. Note that `Tags Filter` will not work for `My bookmarks` option',
        suggestedValue: SearchType.EntireSite,  
        autocomplete: [SearchType.EntireSite, SearchType.MyBookmarks] 
      }),
      dateRange,
      includeQuestionBody,
      tagsListParameter,
    ],
    execute: async ([searchType, dateRange, includeMarkdownBody, tags], context) => {
      let page = (context.sync.continuation?.page as number) || 1;
      const tagsFilter = tags.join(';');
      let response = await getQuestions({fromDate: dateRange[0], toDate: dateRange[1], tags: tagsFilter, page}, searchType as SearchType, context, includeMarkdownBody);
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
