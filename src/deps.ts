import { Octokit } from "octokit";
import { extractGoDotMod } from "./extractGoDotMod";
import { extractPackageDotJSON } from "./extractPackageDotJSON";
import { Project } from "./projects";

export interface Dependency {
  project: Project;
  dependencies: { [key: string]: string };
  devDependencies: { [key: string]: string };
  contributors: string[];
}

export const extractDeps = async (
  octokit: Octokit,
  project: Project
): Promise<Dependency[]> => {
  const packageDotJSON = await extractPackageDotJSON(octokit, project);
  const result: Dependency[] = [];

  if (packageDotJSON) {
    // TODO: js project, let's checkout subpackages!
    const { dependencies, devDependencies, contributors } = packageDotJSON;
    result.push({ project, dependencies, devDependencies, contributors });
    return result;
  }

  const goDotMod = await extractGoDotMod(octokit, project);

  if (goDotMod) {
    // subpackages?
    const { dependencies, devDependencies, contributors } = goDotMod;
    result.push({ project, dependencies, devDependencies, contributors });
    return result;
  }

  return result;
};
