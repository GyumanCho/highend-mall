// Expo + pnpm monorepo Metro 설정
// docs/mobile-native/architecture.md §2.1 참조
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Metro가 monorepo 루트까지 watch
config.watchFolders = [workspaceRoot];

// 2. packages/* 의 node_modules도 해결 가능하게
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. pnpm symlink 지원
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
