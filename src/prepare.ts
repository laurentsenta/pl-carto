import fs from "fs";

interface INode {
  name: string;
  group: string;
  dependencies: number;
}

interface ILink {
  source: number;
  target: number;
  weight: number;
}

interface IGraph {
  nodes: INode[];
  links: ILink[];
}

const main = async () => {
  const data = JSON.parse(fs.readFileSync("./data/dependencies.json", "utf8"));

  const output: IGraph = {
    nodes: [],
    links: [],
  };

  const nodeIds: { [key: string]: number } = {};

  // Create graph
  data.forEach((n: any) => {
    const name = n.project.name;
    const group = "TODO GO / JS / RUST / OTHER";

    if (!nodeIds[name]) {
      nodeIds[name] = output.nodes.length;
      output.nodes.push({ name, group, dependencies: 0 });
    }

    const id1 = nodeIds[name];

    if (!n.dependencies) {
      return;
    }

    // Create & Link siblings
    Object.entries(n.dependencies).forEach(([k, v]: any) => {
      const name = k;

      if (!nodeIds[name]) {
        nodeIds[name] = output.nodes.length;
        output.nodes.push({ name, group, dependencies: 1 });
      } else {
        output.nodes[nodeIds[name]].dependencies += 1;
      }

      const id2 = nodeIds[name];
      output.nodes[id1].dependencies += 1;
      const link: ILink = { source: id1, target: id2, weight: 1 };
      output.links.push(link);
    });
  });

  fs.writeFileSync(
    "./data/prepared.json",
    JSON.stringify(output, undefined, 2)
  );
};

main();
