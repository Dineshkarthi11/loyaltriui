const fs = require("fs");

// Read current version from .env file
require("dotenv").config();
const currentVersion = process.env.REACT_APP_BUILD_VERSION;

// Increment version (example: increase the patch version)
const versionParts = currentVersion.split(".");
const newVersion = `${versionParts[0]}.${versionParts[1]}.${
  parseInt(versionParts[2]) + 1
}`;

// Update .env file with new version
fs.writeFileSync(".env", `REACT_APP_BUILD_VERSION=${newVersion}`);
