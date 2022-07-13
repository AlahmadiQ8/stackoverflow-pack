# Stackoverflow Coda Pack

## Contributing

### Local Development in Docker Container

The easiest way to develop locally is to use the development docker container.

1. Install [VSCode Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension. 
2. Run the `Remote-Containers: Open Folder in Container...` command and select the local folder.

A new VSCode window will launch where you can run both 


### Setup Stackoverflow Authentication 

```
npx coda auth path/to/pack.ts
```

### Running Commands Locally

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

### Uploading the pack

See [Using the CLI - Coda Pack SDK: Uploading Packs]https://coda.io/packs/build/latest/guides/development/cli/#upload

## Features I wish I had

* Autocomplete for array parameter type
* conditional parameters based on previous parameter valuess
* Ability to issue UI warning for the user `coda.showUserFriendlyWarning()`
* Environment Variables that can be set from the coda UI and be set differently locally (something like .env file)
* Autocomplete to work on column format that uses parameters having autocomplete fields 

## Bugs 

* Autocomplete doesn't work when your search term contains the symbol `-`. Example: I want to type `azure-function`, as soon as I type `azure-` the autocomplete stops.