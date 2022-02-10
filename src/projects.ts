import fs from "fs";
import { Octokit } from "octokit";

export interface Project {
  id: number;
  private: boolean;
  full_name: string;
  name: string;
  node_id: string;
  owner: {
    id: number;
    login: string;
    type: "Organization" | string; // note for myself
  };
}

export const loadProjects = async (
  octokit: Octokit,
  org: string
): Promise<Project[]> => {
  const path = `./data/org-${org}-projects.json`;

  try {
    const f = fs.readFileSync(path, "utf8");
    return JSON.parse(f);
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      throw err;
    }
    // else continue
  }

  const iterator = octokit.paginate.iterator("GET /orgs/{org}/repos", {
    org,
    per_page: 100,
  });

  const result = [];

  for await (const { data: projects } of iterator) {
    for (const project of projects) {
      result.push(project);
    }
  }

  fs.writeFileSync(path, JSON.stringify(result, undefined, 2), {
    encoding: "utf8",
  });

  return result;
};
