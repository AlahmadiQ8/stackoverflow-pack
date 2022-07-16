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
* Button to trigger Sync table

## Bugs 

* Autocomplete doesn't work when your search term contains the symbol `-`. Example: I want to type `azure-function`, as soon as I type `azure-` the autocomplete stops.

## Questions to Ask in Office Hours

* [x] Discuss Features & bugs
* [x] Discuss Demo Doc
  * Come up with ideas for demo doc
  * Discuss structure
* [x] User feedback 
  * Since you are my target user, what other things you would expect to see?
* [x] Structure
  * Showcase the pack
  * Quick demo about usage
  * Show case the demo doc (submission doc).
  * 


Entries will be judged on the following equally weighted criteria, and according to the sole and absolute discretion of the judges:

Potential Impact (How useful would the Pack be to Coda users? How many use cases does it unlock in Coda?)
Design and Features (Is the user experience and design of the project well thought out? Have you taken advantage of relevant features of the platform to make your Pack more useful? How well have you adhered to our Best Practices?)
Compelling Demo (How well do you demonstrate the value of the Pack? Is the demo doc well designed and visually interesting?)
Quality of the Idea (How creative and unique is the project?)