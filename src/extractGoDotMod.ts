import fs from "fs";
import { Octokit } from "octokit";
import { PackageDotJSON } from "./extractPackageDotJSON";
import { parseDotMod } from "./parseDotMod";
import { Project } from "./projects";

export const extractGoDotMod = async (
  octokit: Octokit,
  project: Project
): Promise<PackageDotJSON | null> => {
  const path = `./data/cache-${project.owner.login}-${project.name}-goDotMod.json`;

  try {
    const f = fs.readFileSync(path, "utf8");
    return parseDotMod(f);
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      throw err;
    }
    // else continue
  }

  try {
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: project.owner.login,
        repo: project.name,
        path: "go.mod",
      }
    );

    // @ts-ignore
    const { content, type } = data;

    if (type !== "file") {
      throw new Error("invalid result");
    }

    const fileContent = Buffer.from(content, "base64");

    fs.writeFileSync(path, fileContent);
    return parseDotMod(fileContent.toString("utf8"));
  } catch (err: any) {
    if (err.status === 404) {
      // skip
    } else {
      console.error(err);
    }
  }

  return null;
};
