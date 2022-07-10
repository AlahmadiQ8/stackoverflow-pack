
/**
 * stackoverflow filter to include and exlude response fields. 
 * This is generated statically. This is generated statically using /filters/create
 * See https://api.stackexchange.com/docs/filters for more info
 * To see what fields included, try GET https://api.stackexchange.com/2.3/filters/!4kiSra10*uOIiKTB*9dZ2QjFa 
 */
export const filter = '!4kiSra10*uOIiKTB*9dZ2QjFa';

/**
 * stackoverflow filter to include and exlude response fields. 
 * This is generated statically. This is generated statically using /filters/create
 * The only different to {@link filter} is that this one includes question.body_markdown field
 * We have this in case the pack consumer wants to include the question body when syncing cable
 * We did not include it by default because this will make the fetch calls expensive 
 * See https://api.stackexchange.com/docs/filters for more info
 * To see what fields included, try GET https://api.stackexchange.com/2.3/filters/!VmX2VPPqyz*SKc(sJIAb(2kPtN 
 */
export const filterWithQuestionBody = '!VmX2VPPqyz*SKc(sJIAb(2kPtN';

/**
 * This key must be used with the access token for increased throttle quota
 * This key is safe to store on the client.
 * See https://api.stackexchange.com/docs/throttle for more info 
 */
export const seKey = '0z9mHguI53wsnmgPMUFN6A((';

/**
 * Default maximum number of questions to fetch per request
 */
export const defaultPageSize = 30;

/**
 * Regex for matching stackoverflow question url
 * it encapsulates the question id in a regex group to be extracted
 */
export const questionUrlRegex = new RegExp("^https://stackoverflow.com/questions/([^/]+)/[^/]+");