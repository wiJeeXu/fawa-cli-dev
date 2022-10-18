"use strict";
module.exports = core;
const semver = require("semver");
const colors = require("colors");
const userHome = require("user-home");
const pathExists = require("path-exists").sync;
const log = require("@fawa-cli-dev/log");

const pkg = require("../package.json");
const constant = require("./const");
let args;
function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    checkInputArgs();
    log.verbose("debug", "test debug log");
  } catch (e) {
    log.error(e.message);
  }
}

function checkInputArgs() {
  const minimist = require("minimist");
  args = minimist(process.argv.slice(2));
  checkArgs();
}
function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = "verbose";
  } else {
    process.env.LOG_LEVEL = "info";
  }
  log.level = process.env.LOG_LEVEL;
}

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red("当前登陆用户主目录不存在"));
  }
}

function checkRoot() {
  const rootCheck = require("root-check");
  rootCheck();
}

function checkNodeVersion() {
  // 第一步，获取当前Node版本号
  const currentVersion = process.version;
  // 第二步，比对最低版本好
  const lowestVersion = constant.LOWEST_NODE_VERSION;
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(
      colors.red(`fawa-cli-dev 需要安装 v${lowestVersion} 以上版本的 Node.js`)
    );
  }
}

function checkPkgVersion() {
  log.notice("cli", pkg.version);
}
