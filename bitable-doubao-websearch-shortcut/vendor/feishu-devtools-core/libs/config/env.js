"use strict";

let currentEnv = null;

async function getEnv() {
  return (
    currentEnv || {
      id: "default",
      environments: [{ id: "default", name: "default" }],
    }
  );
}

async function setEnv(env) {
  currentEnv = env || null;
  return getEnv();
}

module.exports = {
  __esModule: true,
  default: { getEnv, setEnv },
  getEnv,
  setEnv,
};

