# Stack Overflow Coda Pack

This repo hosts the codebase for [Stack Overflow Coda Pack](https://coda.io/packs/stack-overflow-12829). The pack allows to work with data from [Stack Overflow](https://stackoverflow.com/) directly in your doc.

# Running Locally

See [Get started on your local machine](https://coda.io/packs/build/latest/tutorials/get-started/cli/). However, I think it's easier to develop in the docker container as shown below.

### Local Development in Docker Container

The easiest way to develop locally is to use the development docker container.

1. Install [VSCode Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension. 
2. Run the `Remote-Containers: Open Folder in Container...` command and select the local folder.

A new VSCode window will launch where you can develop and run commands in a bash terminal. 

### Setup Stackoverflow Authentication 

You need to have a client id and client secret to enable the pack to use the Stack Overflow API.

1. Create an Stack Exchange app at https://stackapps.com/apps/oauth/register
2. Fill out the required fields. For the OAuth Domain, use the value `localhost`.
3. Once created, copy the Client Id and Client Secret
3. (optional) For write apis such as Bookmark action (`/questions/${id}/favorite`), you must edit the app and add a Stack App Post. Post a new question on Stack Exchange with the tags `app` or `script` and post the question url value field.
4. Run `npx coda auth pack.ts`. It will ask you for the client id and client secret you copied in the previous page. 

Once done, `.coda-credentials.json` file will be generated. Make sure you edit the `scopes` as shown below: 

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

### Running Commands Locally

Here is an example on how to test formulas locally: 

```bash
# Formula: Question
npx coda execute pack.ts Question https://stackoverflow.com/questions/72913818/how-to-access-my-sprite-properties-from-outside-a-function-in-phaser3-and-matter

# Sync Table:
npx coda execute pack.ts Questions "All stackoverflow" "2022-02-01,2022-05-01" "false" "reactjs,nextjs,vercel"
npx coda execute pack.ts Questions "My bookmarks" "" "false" "reactjs"

# Bookmark Question
npx coda execute pack.ts BookmarkQuestion "https://stackoverflow.com/questions/72931914/error-usehref-may-be-used-only-in-the-context-of-a-router-component-in-reg"

# Undo Bookmark Question
npx coda execute pack.ts UndoBookmarkQuestion "https://stackoverflow.com/questions/72931914/error-usehref-may-be-used-only-in-the-context-of-a-router-component-in-reg"
```
