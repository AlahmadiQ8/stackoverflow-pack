# Stack Overflow Coda Pack <!-- omit in toc -->

This repo hosts the codebase for [Stack Overflow Coda Pack](https://coda.io/packs/stack-overflow-12829). The pack allows to work with data from [Stack Overflow](https://stackoverflow.com/) directly in your doc.

---

- [Running Locally](#running-locally)
  - [Local Development in Docker Container](#local-development-in-docker-container)
  - [Setup Stack Overflow Authentication](#setup-stackoverflow-authentication)
- [Running Commands Locally](#running-commands-locally)
- [Experimenting with Stack Overflow API with Postman](#experimenting-with-stack-overflow-api-with-postman)

---

## Running Locally

See [Get started on your local machine](https://coda.io/packs/build/latest/tutorials/get-started/cli/). However, I think it's easier to develop in the docker container as shown below.

### Local Development in Docker Container

1. Install [Docker](https://docs.docker.com/engine/install/)
2. Install [VSCode Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension.
3. Run the `Remote-Containers: Open Folder in Container...` command and select the local folder.
4. A new VSCode window will launch where you can develop and run commands in a bash terminal.

There's also an in-depth guide on how to develop coda packs with docker containers: https://github.com/AlahmadiQ8/coda-pack-local-dev

### Setup Stack Overflow Authentication

You need to have a client id and client secret to enable the pack to use the Stack Overflow API.

1. Create an Stack Exchange app at https://stackapps.com/apps/oauth/register
2. Fill out the required fields. For the OAuth Domain, use the value `localhost`. NOTE: if you want to use Postmant to experiment with the api, use the value `pstmn.io` instead.
3. Once created, copy the Client Id and Client Secret
4. (optional) For write apis such as Bookmark action (`/questions/${id}/favorite`), you must edit the app and add a Stack App Post. Post a new question on Stack Exchange with the tags `app` or `script` and post the question url value field.

![](/assets/stack-exchange-settings-screenshot.png)

Once done, run `npx coda auth pack.ts`. It will ask you for the client id and client secret you copied in the previous page. `.coda-credentials.json` file will be generated. Make sure you edit the `scopes` as shown below:

```json
{
  "credentials": {
    "clientId": "23844",
    "clientSecret": "xxxxxxxxxxxxxxxxxxx",
    "accessToken": "xxxxxxxxxxxxxxxxxxx",
    "scopes": [
      "read_inbox",
      "no_expiry",
      "private_info",
      "write_access"
    ]
  }
}
```

## Running Commands Locally

Here is an example on how to test formulas locally:

```bash
# Formula: Question
npx coda execute pack.ts Question https://stackoverflow.com/questions/72913818/how-to-access-my-sprite-properties-from-outside-a-function-in-phaser3-and-matter

# Sync Table:
npx coda execute pack.ts Questions "All Stack Overflow" "2022-02-01,2022-05-01" "false" "reactjs,nextjs,vercel"
npx coda execute pack.ts Questions "My bookmarks" "" "false" "reactjs"

# Bookmark Question
npx coda execute pack.ts BookmarkQuestion "https://stackoverflow.com/questions/72931914/error-usehref-may-be-used-only-in-the-context-of-a-router-component-in-reg"

# Undo Bookmark Question
npx coda execute pack.ts UndoBookmarkQuestion "https://stackoverflow.com/questions/72931914/error-usehref-may-be-used-only-in-the-context-of-a-router-component-in-reg"
```

## Experimenting with Stack Overflow API with Postman

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/2866939-edf7c77c-a303-4a74-9208-d80eb7b82a53?action=collection%2Ffork&collection-url=entityId%3D2866939-edf7c77c-a303-4a74-9208-d80eb7b82a53%26entityType%3Dcollection%26workspaceId%3Dce07deaf-31f3-40f0-90c5-4f8800bdbbd0)

You can experiment with [Stack Overflow API](https://api.stackexchange.com/) with Postment by forking the collection in the button above. 

* Keep in mind that you must have the following environment variables to run the requests in the collection:
  * `ClientId`
  * `ClientSecret`
  * `key`
* Edit the Stack Exchange App such that for the OAuth Domain, the value should be `pstmn.io`

These values correspond to the Stack Exchange app created as shown below:

![Stack Exchange App](/assets/stack-exchange-app-screenshot.png)

Then, generate an access token by going to the collection settings under the Authorization tab and clicking `Get New Access Token`

![Postman - Get Access Token](/assets/postmand-screenshot.png)
