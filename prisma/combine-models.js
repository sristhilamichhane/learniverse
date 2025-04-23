const fs = require("fs");
const path = require("path");

// Read the header content (database configuration)
const headerContent = `generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextIndex"]
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

`;

// Read all model files
const modelsDir = path.join(__dirname, "models");
const modelFiles = fs
  .readdirSync(modelsDir)
  .filter((file) => file.endsWith(".model.prisma"));

// Combine all models
let combinedSchema = headerContent;
modelFiles.forEach((file) => {
  const modelContent = fs.readFileSync(path.join(modelsDir, file), "utf8");
  combinedSchema += "\n" + modelContent;
});

// Write the combined schema
fs.writeFileSync(path.join(__dirname, "schema.prisma"), combinedSchema);
console.log("Schema files combined successfully!");
