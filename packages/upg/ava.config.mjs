export const avaConfig = {
  "timeout": "2m",
  "files": [
    "test/**/*.test.ts"
  ],
  "extensions": {
    "ts": "module"
  },
  "nodeArguments": [
    "--no-warnings",
    "--loader=@tsmodule/tsmodule/loader"
  ]
};

export default avaConfig;