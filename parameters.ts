import * as coda from "@codahq/packs-sdk";
import { getTags } from "./helpers";
import { SearchType, SeContinuation, Tag } from "./types";

export const dateRange = coda.makeParameter({
  type: coda.ParameterType.DateArray,
  name: "DateCreated",
  description: "Filter by created date",
  optional: false,
})

export const includeQuestionBody = coda.makeParameter({
  type: coda.ParameterType.Boolean,
  name: "IncludeQuestionBody",
  description: "Whether to fetch question body or not. Becareful, enabling it results in expensive network calls",
  optional: false,
  suggestedValue: false
})

export const tagParameter = coda.makeParameter({
  type: coda.ParameterType.String,
  name: 'Tag',
  description: 'A tag is a word or phrase that describes the topic of the question',
  autocomplete: fetchTagsForAutocomplete,
})

export const tagsListParameter = coda.makeParameter({
  type: coda.ParameterType.StringArray,
  name: 'TagsFilter',
  description: `Tags to filter. You can use 'FindTags()', 'MyTags()', or 'TagSynonyms()' formulas to find tags. This Filter will not work with ${SearchType.MyBookmarks}`
})

async function fetchTagsForAutocomplete(context: coda.ExecutionContext, search: string) {
  const result: Tag[] = [];  
  let continuation: SeContinuation | undefined;
  let maxResultCount = 15;
  let currentResultCount = 0;
  do {    
    let response = await getTags(search, context, continuation, 15);
    currentResultCount = result.push(...response.result);
    ({continuation} = response);
  } while (currentResultCount < maxResultCount && continuation?.hasMore);
  return coda.autocompleteSearchObjects(search, result, 'name', 'name');
}