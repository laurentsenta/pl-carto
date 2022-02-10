import { Octokit } from "octokit";
import { Dependency, extractDeps } from "./deps";
import { loadProjects } from "./projects";
import fs from "fs";

const GH_ACCESS_TOKEN = process.env.GH_ACCESS_TOKEN;

const main = async () => {
  console.log("GH_ACCESS_TOKEN?", !!GH_ACCESS_TOKEN);
  const octokit = new Octokit({ auth: GH_ACCESS_TOKEN });

  const org = "libp2p";
  const projects = await loadProjects(octokit, org);

  let allDeps: Dependency[] = [];

  for (const project of projects) {
    const d = await extractDeps(octokit, project);
    allDeps = allDeps.concat(d);
  }

  fs.writeFileSync(
    "./data/dependencies.json",
    JSON.stringify(allDeps, undefined, 2)
  );
};

main();
