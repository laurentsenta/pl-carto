import { PackageDotJSON } from "./extractPackageDotJSON";

const goToPackageJSON = (dep: string): [string, string] => {
  const [a, b] = dep.split(/\s+/);
  console.log(a, b);

  if (a.startsWith("github.com/")) {
    return [a.substring("github.com/".length), b];
  }

  return [a, b];
};

const mungeDeps = (depsMatch: string): { [key: string]: string } => {
  const deps = depsMatch
    .trim()
    .split(/\n/)
    .filter((x) => x.length > 0)
    .map((x) => x.trim())
    .map(goToPackageJSON)
    .reduce((prev, current) => {
      return { ...prev, [current[0]]: current[1] };
    }, {});

  return deps;
};

export const parseDotMod = (stringContent: string): PackageDotJSON | null => {
  const RE_MATCH_REQUIRE_CONTENT = /require\s*\(((\s|[^)])*)\)/m;
  const RE_MATCH_REQUIRE_CONTENT_SIMPLE = /require\s*([^\n]*)\n/;

  let match = stringContent.match(RE_MATCH_REQUIRE_CONTENT);

  if (match) {
    const group = match[1];

    if (!group) {
      throw new Error("invalid match");
    }

    const deps = mungeDeps(group);
    return { dependencies: deps, contributors: [], devDependencies: {} };
  }

  match = stringContent.match(RE_MATCH_REQUIRE_CONTENT_SIMPLE);

  if (match) {
    const group = match[1];

    if (!group) {
      throw new Error("invalid match");
    }

    const deps = mungeDeps(group);
    return { dependencies: deps, contributors: [], devDependencies: {} };
  }

  console.warn("no match for:", stringContent);
  return { dependencies: {}, contributors: [], devDependencies: {} };
};


// a few tests for quick debugging.

const EXAMPLE_A = `
module github.com/libp2p/go-cidranger

go 1.16

require (
	github.com/ipfs/go-detect-race v0.0.1
	github.com/stretchr/testify v1.4.0
)
`;
console.log("EXAMPLE_A", parseDotMod(EXAMPLE_A));

const EXAMPLE_B = `
module github.com/libp2p/go-libp2p-backoff

go 1.16

// This is https://github.com/libp2p/go-libp2p-core/pull/127
require github.com/libp2p/go-libp2p-core v0.3.2-0.20200309235421-78ba12ebcdd4

require (
	github.com/hashicorp/golang-lru v0.5.4 // indirect
	github.com/ipfs/go-log v1.0.4 // indirect
	github.com/jbenet/go-temp-err-catcher v0.1.0 // indirect
	github.com/jbenet/goprocess v0.1.4 // indirect
	github.com/libp2p/go-addr-util v0.0.2 // indirect
	github.com/libp2p/go-libp2p-blankhost v0.1.4 // indirect
	github.com/libp2p/go-libp2p-discovery v0.2.0
	github.com/libp2p/go-libp2p-swarm v0.2.2 // indirect
	github.com/libp2p/go-libp2p-testing v0.1.1 // indirect
	github.com/libp2p/go-libp2p-yamux v0.2.1 // indirect
	github.com/libp2p/go-openssl v0.0.5 // indirect
	github.com/libp2p/go-reuseport-transport v0.0.3 // indirect
	github.com/libp2p/go-yamux v1.3.7 // indirect
	github.com/multiformats/go-multiaddr v0.3.3
	github.com/multiformats/go-multiaddr-net v0.1.5 // indirect
	github.com/multiformats/go-multistream v0.1.1 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/stretchr/testify v1.6.1 // indirect
	golang.org/x/sys v0.0.0-20200202164722-d101bd2416d5 // indirect
	golang.org/x/tools v0.0.0-20191108193012-7d206e10da11 // indirect
)
 `;
console.log("EXAMPLE_B", parseDotMod(EXAMPLE_B));

const EXAMPLE_C = `
 module github.com/libp2p/go-libp2p-crypto

require github.com/libp2p/go-libp2p-core v0.0.1
`;
console.log("EXAMPLE_C", parseDotMod(EXAMPLE_C));
