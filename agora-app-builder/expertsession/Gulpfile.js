/*
********************************************
 Copyright © 2021 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/
const {series, parallel, src, dest} = require('gulp');
const {spawn} = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const del = require('del');
const config = require('./config.json');
const replace = require('gulp-replace');
const concat = require('gulp-concat');
const header = require('gulp-header');
const semver = require('semver');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.renderer.config');
const webpackRsdkConfig = require('./webpack.rsdk.config');

const outPathArg = process.argv.indexOf('--outpath');
getBuildPath = () => {
  if (outPathArg == -1) {
    return process.env.TARGET === 'wsdk'
      ? path.join(__dirname, '../Builds/web-sdk')
      : process.env.TARGET === 'rsdk'
      ? path.join(__dirname, '../Builds/react-sdk')
      : process.env.TARGET === 'android'
      ? path.join(__dirname, '../Builds/android')
      : path.join(__dirname, '../Builds/.electron');
  } else {
    return process.argv[outPathArg + 1].split('/').slice(0, -1).join('/');
  }
};
const BUILD_PATH = getBuildPath();
const TS_DEFS_BUILD_PATH =
  process.env.TARGET === 'wsdk'
    ? path.join(__dirname, '../Builds/ts-defs/web-sdk')
    : process.env.TARGET === 'rsdk'
    ? path.join(__dirname, '../Builds/ts-defs/react-sdk')
    : process.env.TARGET === 'android'
    ? path.join(__dirname, '../Builds/ts-defs/android')
    : path.join(__dirname, '../Builds/ts-defs/.electron');

const debugFlag = process.argv.indexOf('--debug') !== -1;

const pkgNameArg = process.argv.indexOf('--pkgname');
const PACKAGE_NAME =
  pkgNameArg == -1
    ? process.env.TARGET === 'rsdk'
      ? '@appbuilder/react'
      : process.env.TARGET === 'wsdk'
      ? '@appbuilder/web'
      : 'agora-app-builder-sdk'
    : process.argv[pkgNameArg + 1];

const runCli = (cmd, cb) => {
  const [arg1, ...arg2] = cmd.split(' ');
  const proc = spawn(arg1, arg2, {
    stdio: 'inherit',
    shell: true,
  });
  proc.on('exit', cb);
};

const runCliNoOutput = (cmd, cb) => {
  const [arg1, ...arg2] = cmd.split(' ');
  const proc = spawn(arg1, arg2, {
    stdio: 'ignore',
    shell: true,
  });
  proc.on('exit', cb);
};

const general = {
  cleanBuildDirectory: () => {
    return del([`${BUILD_PATH}/**/*`], {force: true});
  },
  addPackageInfo: async cb => {
    let {private, author, description, dependencies} = JSON.parse(
      await fs.readFile(path.join(__dirname, 'package.json')),
    );

    // Tries to fetch version and dependencies from parent package.json

    let {dependencies: parentDependencies, version: parentVersion} = JSON.parse(
      await fs.readFile(path.join(__dirname, '..', 'package.json')),
    );

    // If parentDependencies present derives base version from cli version ( prod )
    // otherwise uses version number from parent package.json ( dev )

    let baseVersion = parentDependencies
      ? parentDependencies['agora-app-builder-cli']
      : parentVersion;

    // Generates unique hash

    const nanoid = await import('nanoid');
    const alphabet =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    let versionHash = nanoid.customAlphabet(alphabet, 10)();

    // Hash appended to base version to create unique version for every build.

    let version = semver.minVersion(`${baseVersion}-${versionHash}`).version;

    let newPackage = {
      name: PACKAGE_NAME,
      version,
      private,
      author,
      description,
    };

    // Target specific changes

    if (process.env.TARGET === 'rsdk') {
      newPackage.main = 'index.js';
      newPackage.types = 'index.d.ts';

      // Takes externals from the webpack config and applies them
      // to react-sdk package as peer dependencies
      newPackage.peerDependencies = Object.keys(dependencies)
        .filter(key => Object.keys(webpackRsdkConfig.externals).includes(key))
        .reduce((peerDependencies, key) => {
          peerDependencies[key] = `^${dependencies[key].split('.')[0]}`;
          return peerDependencies;
        }, {});
    }

    if (process.env.TARGET === 'wsdk') {
      newPackage.main = 'app-builder-web-sdk.umd2.js';
      newPackage.types = 'index.d.ts';
    }

    await fs.writeFile(
      path.join(BUILD_PATH, 'package.json'),
      JSON.stringify(newPackage, null, 2),
    );
    return;
  },
  createBuildDirectory: () => {
    return fs.mkdir(BUILD_PATH, {recursive: true});
  },
  generateApiTypedefs: cb => {
    const cli = debugFlag ? runCli : runCliNoOutput;
    cli(
      'npx -p typescript tsc --project tsconfig_fpeApi.json --outFile ../Builds/customization-api.d.ts',
      () => cb(),
    );
  },
  bundleApiTypedefs: () => {
    return src(['../Builds/customization-api.d.ts', './global.d.ts'])
      .pipe(concat('./customization-api.d.ts'))
      .pipe(
        replace(
          `declare var $config: ConfigInterface;
declare module 'customization' {
  const customizationConfig: {};
  export default customizationConfig;
}`,
          ' ',
        ),
      )
      .pipe(replace('"agora-rn-uikit"', '"agora-rn-uikit/src/index"'))
      .pipe(dest('../Builds/'));
  },
  cleanTempFiles: () => {
    return del([`${path.join(BUILD_PATH, '../', '/')}*.d.ts`], {force: true});
  },
  genTsDefs: cb => {
    runCli(
      `mkdir -p ${TS_DEFS_BUILD_PATH} && cp ${BUILD_PATH}/index.d.ts ${TS_DEFS_BUILD_PATH}/index.d.ts`,
      cb,
    );
  },
  useTsDefs: cb => {
    runCli(`cp ${TS_DEFS_BUILD_PATH}/index.d.ts ${BUILD_PATH}/index.d.ts`, cb);
  },
  generateNpmPackage: cb => {
    runCli(`cd ${BUILD_PATH} && npm pack`, cb);
  },
};

const electron = {
  webpack_renderer: cb => {
    runCli('webpack --config webpack.renderer.config.js', cb);
  },

  webpack_main: cb => {
    runCli('webpack --config ./webpack.main.config.js', cb);
  },

  build: cb => {
    runCli('electron-builder build --config ./electron-builder.js', cb);
  },

  devServer: cb => {
    const config = webpack(webpackConfig);
    new WebpackDevServer(config, {
      hot: true,
      client: {
        overlay: false,
      },
    }).listen(webpackConfig.devServer.port, 'localhost', err => {
      if (err) {
        console.error(err);
      } else {
        cb();
      }
    });
  },

  start: cb => {
    runCli('electron ./electron/main/index.js', cb);
  },
};

const reactSdk = {
  webpack: cb => {
    runCli('webpack --config ./webpack.rsdk.config.js', cb);
  },
  esbuild: cb => {
    let outPath = '';
    if (outPathArg != -1) {
      outPath = ` --outpath ${process.argv[outPathArg + 1]}`;
    }
    let configTransformerPath = '';
    const configTransformerPathArg = process.argv.indexOf(
      '--configtransformerpath',
    );
    if (configTransformerPathArg != -1) {
      configTransformerPath = ` --configtransformerpath ${
        process.argv[configTransformerPathArg + 1]
      }`;
    }
    let esbuildCmd = `go build -o ../esbuild-bin/rsdk ./esbuild.rsdk.go && ../esbuild-bin/rsdk${outPath}${configTransformerPath}`;
    console.log(esbuildCmd);
    runCli(esbuildCmd, cb);
  },
  generateSdkTypedefs: cb => {
    const cli = debugFlag ? runCli : runCliNoOutput;
    cli(
      //'npx -p typescript tsc index.rsdk.tsx --declaration --emitDeclarationOnly --noResolve --outFile ../Builds/temp.d.ts',
      'npx -p typescript tsc --project tsconfig_rsdk_index.json --outFile ../Builds/reactSdk.d.ts',
      () => cb(),
    );
  },
  bundleSdkTypedefs: () => {
    return src(['../Builds/customization-api.d.ts', '../Builds/reactSdk.d.ts'])
      .pipe(concat('index.d.ts'))
      .pipe(
        replace(
          'declare module "index.rsdk"',
          `declare module "${PACKAGE_NAME}"`,
        ),
      )
      .pipe(replace("'customization-api'", "'customization-api/index'"))
      .pipe(replace('"customization-api"', '"customization-api/index"'))
      .pipe(header('// @ts-nocheck\n'))
      .pipe(dest(BUILD_PATH));
  },
};

const webSdk = {
  webpack: cb => {
    runCli('webpack --config ./webpack.wsdk.config.js', cb);
  },
  generateSdkTypedefs: cb => {
    const cli = debugFlag ? runCli : runCliNoOutput;
    cli(
      'npx -p typescript tsc --project tsconfig_wsdk_index.json --outFile ../Builds/webSdk.d.ts',
      () => cb(),
    );
  },
  bundleSdkTypedefs: () => {
    return src(['../Builds/customization-api.d.ts', '../Builds/webSdk.d.ts'])
      .pipe(concat('index.d.ts'))
      .pipe(
        replace(
          'declare module "index.wsdk"',
          `declare module "${PACKAGE_NAME}"`,
        ),
      )
      .pipe(replace("'customization-api'", "'customization-api/index'"))
      .pipe(replace('"customization-api"', '"customization-api/index"'))
      .pipe(header('// @ts-nocheck\n'))
      .pipe(dest(BUILD_PATH));
  },
  npmPack: cb => {
    runCli('cd ../Builds/web-sdk && npm pack', cb);
  },
};

const android = {
  gradleBuildUnix: cb => {
    runCli('cd android && ./gradlew assembleRelease', cb);
  },
  gradleBuildWin: cb => {
    runCli('cd android && gradlew.bat assembleRelease', cb);
  },
  copyBuild: cb => {
    fs.copyFile(
      path.resolve(
        'android',
        'app',
        'build',
        'outputs',
        'apk',
        'release',
        'app-release.apk',
      ),
      path.resolve(BUILD_PATH, `${config.PRODUCT_ID}.apk`),
    )
      .then(() => {
        cb();
      })
      .catch(err => {
        cb(new Error('Error in copying build', err));
      });
  },
};

// electron
module.exports.electron_build = series(
  general.cleanBuildDirectory,
  general.createBuildDirectory,
  parallel(
    electron.webpack_renderer,
    electron.webpack_main,
    general.addPackageInfo,
  ),
  electron.build,
);

module.exports.electron_development = series(
  general.cleanBuildDirectory,
  general.createBuildDirectory,
  electron.devServer,
  electron.webpack_main,
  electron.start,
);

// react-sdk
module.exports.reactSdk = series(
  general.cleanBuildDirectory,
  general.createBuildDirectory,
  general.addPackageInfo,
  reactSdk.webpack,
  general.generateApiTypedefs,
  general.bundleApiTypedefs,
  reactSdk.generateSdkTypedefs,
  reactSdk.bundleSdkTypedefs,
  general.cleanTempFiles,
  general.generateNpmPackage,
);

// react-sdk-esbuild
module.exports.reactSdkEsbuild = series(
  general.cleanBuildDirectory,
  general.createBuildDirectory,
  general.addPackageInfo,
  reactSdk.esbuild,
  general.generateApiTypedefs,
  general.bundleApiTypedefs,
  reactSdk.generateSdkTypedefs,
  reactSdk.bundleSdkTypedefs,
  general.cleanTempFiles,
  general.generateNpmPackage,
);

// generate typescript definitions
module.exports.makeRsdkTsDefs = series(
  general.cleanBuildDirectory,
  general.createBuildDirectory,
  general.addPackageInfo,
  reactSdk.webpack,
  general.generateApiTypedefs,
  general.bundleApiTypedefs,
  reactSdk.generateSdkTypedefs,
  reactSdk.bundleSdkTypedefs,
  general.cleanTempFiles,
  general.genTsDefs,
);

// react-sdk-esbuild with cached type definitions
module.exports.reactSdkEsbuildCachedTsc = series(
  general.cleanBuildDirectory,
  general.createBuildDirectory,
  general.addPackageInfo,
  reactSdk.esbuild,
  general.useTsDefs,
  general.generateNpmPackage,
);

// web-sdk
module.exports.webSdk = series(
  general.cleanBuildDirectory,
  general.createBuildDirectory,
  general.addPackageInfo,
  parallel(
    webSdk.webpack,
    series(
      general.generateApiTypedefs,
      general.bundleApiTypedefs,
      webSdk.generateSdkTypedefs,
      webSdk.bundleSdkTypedefs,
      general.cleanTempFiles,
    ),
  ),
  general.generateNpmPackage,
);

module.exports.makeWsdkTsDefs = series(
  general.cleanBuildDirectory,
  general.createBuildDirectory,
  general.addPackageInfo,
  parallel(
    webSdk.webpack,
    series(
      general.generateApiTypedefs,
      general.bundleApiTypedefs,
      webSdk.generateSdkTypedefs,
      webSdk.bundleSdkTypedefs,
      general.cleanTempFiles,
    ),
  ),
  general.genTsDefs,
);

module.exports.webSdkCachedTsc = series(
  general.cleanBuildDirectory,
  general.createBuildDirectory,
  general.addPackageInfo,
  parallel(webSdk.webpack, general.useTsDefs),
  general.generateNpmPackage,
);

module.exports.androidUnix = series(
  general.cleanBuildDirectory,
  general.createBuildDirectory,
  android.gradleBuildUnix,
  android.copyBuild,
);

module.exports.androidWin = series(
  general.cleanBuildDirectory,
  general.createBuildDirectory,
  android.gradleBuildWin,
  android.copyBuild,
);

module.exports.test = series(
  general.createBuildDirectory,
  general.generateApiTypedefs,
  general.bundleApiTypedefs,
  webSdk.generateSdkTypedefs,
  webSdk.bundleSdkTypedefs,
  general.cleanTempFiles,
  general.genTsDefs,
);
