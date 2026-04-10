module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@": "./",
          },
        },
      ],
      // Reanimated 4 / Worklets — 반드시 마지막
      "react-native-worklets/plugin",
    ],
  };
};
