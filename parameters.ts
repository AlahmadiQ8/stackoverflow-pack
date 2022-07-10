import * as coda from "@codahq/packs-sdk";
import { getTags } from "./helpers";
import { SeContinuation, Tag } from "./types";

export const dateRange = coda.makeParameter({
  type: coda.ParameterType.DateArray,
  name: "dateRange",
  description: "The date range over which data should be fetched.",
  optional: false,
})

export const tagsParameter = coda.makeParameter({
  type: coda.ParameterType.String,
  name: 'AddTagFilter',
  description: 'Filter result by tag.',
  optional: false,
  autocomplete: fetchTagsForAutocomplete
})

export const anotherTagsParameter = coda.makeParameter({
  type: coda.ParameterType.String,
  name: 'AddAnotherTagFilter',
  description: 'Add more tags to filter and further narrow results',
  optional: true,
  autocomplete: fetchTagsForAutocomplete
})

export const includeQuestionBody = coda.makeParameter({
  type: coda.ParameterType.Boolean,
  name: "IncludeQuestionBody",
  description: "Whether to fetch question body or not. Becareful, enabling it results in expensive network calls",
  optional: false,
  suggestedValue: false
})

async function fetchTagsForAutocomplete(context: coda.ExecutionContext, search: string) {
  let result: Tag[] = [];  
  let continuation: SeContinuation | undefined;
  let maxResultCount = 15;
  let currentResultCount = 0;
  do {    
    let response = await getTags(search, context, continuation, 15);
    result = result.concat(...response.result);
    currentResultCount = result.length;
    ({continuation} = response);
  } while (currentResultCount < maxResultCount && continuation?.hasMore);
  return coda.autocompleteSearchObjects(search, result, 'name', 'name');
}