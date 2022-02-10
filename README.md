In [2019](https://discuss.libp2p.io/t/forums-discuss-libp2p-io-operation-protocol/69) we wrote:

> With over 150+ repos, the libp2p organisation is a Github labyrinth. It’s not easy for users to find the right place to post an enquiry.

Today we have

- 200+ repos in the libp2p org.
- 170+ repos in the ipfs org

Fixing one issue will take you accross multiple repos and projects. What if you could navigate through project, code, etc. as if it was a single unified codebase?

:warning: this has 0 design, parsing is done with simple regexp, just a 5 minutes "what would it look like" script.

## Use

Create a `.env` file and add your [github access token](https://github.com/settings/tokens):

```
GH_ACCESS_TOKEN=THIS-IS-SECRET
```

Then use:

```
nvm use # uses node16

npm install

npm run scrap

npm run prepare

npm run dist

npm run serve # then visit the dist/ folder
# you can also:
ipfs add -r dist/ # then open the cid in your explorer
```

## Todo

- clean data
  - seriously design the data structures we want to move around
  - clarify what we want to use this for and what data we want
    - identify orgs, project dependencies, interdependences between issues, etc.
- clean architecture
  - think the scraping pipeline into "processing steps" that are explicit & easy to extend
    - end goal is to have a rust pipeline, go pipeline, js pipeline,
    - Support monorepo (recursive exploration)
    - Support Go correctly
    - Support Rust
    - Support gx
- clean workflow
  - there is a data source in our .github repo I believe
- clean code
  - move out the caching
  - cache also empty response (missing package.json for go project for example)
  - iterations are slow and naive
