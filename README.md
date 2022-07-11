# Stackoverflow Coda Pack

## Local Development in Docker Container

The easiest way to develop locally is to use the development docker container.

1. Install [VSCode Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension. 
2. Run the `Remote-Containers: Open Folder in Container...` command and select the local folder.

A new VSCode window will launch where you can run both 

## Prerequisites

### Setup Stackoverflow Authentication 

```
npx coda auth path/to/pack.ts
```

## Running Commands Locally

```bash
# Formula: Question
npx coda execute pack.ts Question https://stackoverflow.com/questions/72913818/how-to-access-my-sprite-properties-from-outside-a-function-in-phaser3-and-matter

# Sync Table:
npx coda execute pack.ts Questions "2022-02-01,2022-05-01" "false" "reactjs" "nextjs"

# Bookmark Question
npx coda execute pack.ts BookmarkQuestion "https://stackoverflow.com/questions/72931914/error-usehref-may-be-used-only-in-the-context-of-a-router-component-in-reg"

# Undo Bookmark Question
npx coda execute pack.ts UndoBookmarkQuestion "https://stackoverflow.com/questions/72931914/error-usehref-may-be-used-only-in-the-context-of-a-router-component-in-reg"
```

## Uploading the pack

See [Using the CLI - Coda Pack SDK: Uploading Packs]https://coda.io/packs/build/latest/guides/development/cli/#upload