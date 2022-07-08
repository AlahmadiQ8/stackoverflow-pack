import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// stackoverflow filter to include and exlude response fields. 
// This is generated statically. This is generated statically using /filters/create
// See https://api.stackexchange.com/docs/filters for more info 
const filter = '!0XXAMzZV3)6nNHjQ18538kAUL';

// This key must be used with the access token for increased throttle quota
// This key is safe to store on the client. 
// See https://api.stackexchange.com/docs/throttle for more info 
const seKey = '0z9mHguI53wsnmgPMUFN6A((';

// Allow the Pack to access the stackexchange domain.
pack.addNetworkDomain("stackexchange.com");

// Setup per-user authentication using Stackoverflow's OAuth2.
// Remember to set your client ID and secret in the "Settings" tab.
// See https://docs.github.com/en/developers/apps/building-oauth-apps
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://stackoverflow.com/oauth",
  tokenUrl: "https://stackoverflow.com/oauth/access_token/json",
  scopes: ["read_inbox", "no_expiry", "private_info"],
  tokenQueryParam: "access_token",
});

// A schema that defines a repo object.
const RepoSchema = coda.makeObjectSchema({
  properties: {
    repoId: { type: coda.ValueType.Number, fromKey: "id" },
    name: { type: coda.ValueType.String },
    fullName: { type: coda.ValueType.String, fromKey: "full_name" },
    description: { type: coda.ValueType.String },
    url: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
      fromKey: "html_url",
    },
    watchers: { type: coda.ValueType.Number, fromKey: "watchers_count" },
    forks: { type: coda.ValueType.Number, fromKey: "forks_count" },
    stars: { type: coda.ValueType.Number, fromKey: "stargazers_count" },
  },
  displayProperty: "name",
  idProperty: "repoId",
  featuredProperties: ["description", "watchers", "forks", "stars"],
});

// A formula to fetch information about a repo.
pack.addFormula({
  name: "Questions",
  description: "Get starred questions about a user account from it's URL.",
  parameters: [
    // coda.makeParameter({
    //   type: coda.ParameterType.String,
    //   name: "url",
    //   description: "The URL of the repo.",
    // }),
  ],
  resultType: coda.ValueType.Object,
  schema: RepoSchema,
  execute: async function ([], context) {
    console.log('initiating request')
    let response = await context.fetcher.fetch({
      method: "GET",
      url: coda.withQueryParams('https://api.stackexchange.com/2.2/me/favorites', {
        page: 1,
        filter,
        site: 'stackoverflow',
        key: seKey
      })
    });
    let result = response.body;
    console.log(result)
    return result;
  },
});
