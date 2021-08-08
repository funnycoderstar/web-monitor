```js
{
  "name": "fe-tracker-sdk",
  "version": "0.0.4",
  "description": "",
  "keywords": [],
  "main": "dist/fe-tracker-sdk.umd.js",
  "module": "dist/fe-tracker-sdk.es.js",
  "typings": "dist/types/fe-tracker-sdk.d.ts",
  "files": [
    "dist"
  ],
  "author": "碎碎酱 <yinxin630@gmail.com>",
  "repository": {
    "type": "git",
    "url": ""
  },
  "license": "MIT",
  "engines": {
    "node": ">=6.0.0"
  },
  "scripts": {
    "lint": "tslint  --project tsconfig.json -t codeFrame 'src/**/*.ts' 'test/**/*.ts'",
    "prebuild": "rimraf dist",
    "build": "export NODE_ENV=production && tsc --module commonjs && rollup -c rollup.config.ts && typedoc --out docs --target es6 --theme minimal --mode file src",
    "dev": "export NODE_ENV=development && rollup -c rollup.config.ts -w",
    "test": "jest --coverage",
    "test:watch": "jest --coverage --watch",
    "test:prod": "npm run lint && npm run test -- --no-cache",
    "deploy-docs": "ts-node tools/gh-pages-publish",
    "report-coverage": "cat ./coverage/lcov.info | coveralls",
    "commit": "git-cz",
    "semantic-release": "semantic-release",
    "semantic-release-prepare": "ts-node tools/semantic-release-prepare",
    "travis-deploy-once": "travis-deploy-once",
    "changelog": "auto-changelog",
    "version": "npm run build && auto-changelog -p && git add CHANGELOG.md"
  },
  "lint-staged": {
    "{src,test}/**/*.ts": [
      "prettier --write",
      "git add"
    ]
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-conventional-changelog"
    }
  },
  "jest": {
    "transform": {
      ".(ts|tsx)": "ts-jest"
    },
    "testEnvironment": "node",
    "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js"
    ],
    "coveragePathIgnorePatterns": [
      "/node_modules/",
      "/test/"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 90,
        "functions": 95,
        "lines": 95,
        "statements": 95
      }
    },
    "collectCoverageFrom": [
      "src/*.{js,ts}"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "commitlint": {
    "extends": [
      "@commitlint/config-conventional"
    ]
  },
  "auto-changelog": {
    "template": "CHANGELOG.template",
    "unreleased": true,
    "commitLimit": false
  },
  "devDependencies": {
    "@commitlint/cli": "^7.6.1",
  },
  "dependencies": {}
}

```

-   main：指定模块加载的入口文件，如果没有 type 字段，index.js 就会被解释为 CommonJS 模块。
-   module：若项目中有封装模块，可以设置 module, 也就是设置一个模块的入口, 该字段目前比较前卫
-   typings/types：TypeScript 解析文件的入口, 该文件会被发布到 NPM, 并且可以被下载，为用户提供更加好的 IDE 支持。

如果不希望将后缀名改成.mjs，可以在项目的 package.json 文件中，指定 type 字段为 module。该目录里面的 JS 脚本，就被解释用 ES6 模块。
