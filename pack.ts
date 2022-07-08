import * as coda from "@codahq/packs-sdk";
import { getQuestion } from "./helpers";
import { questionSchema } from "./schemas";

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
  description: "Get information about a repo from it's URL.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "url",
      description: "The Url of the question",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: questionSchema,
  execute: getQuestion
});