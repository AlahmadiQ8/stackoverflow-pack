
/**
 * stackoverflow filter to include and exlude response fields. 
 * This is generated statically. This is generated statically using /filters/create
 * See https://api.stackexchange.com/docs/filters for more info 
 */
export const filter = '!4kiSra10*uOIiKTB*9dZ2QjFa';

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