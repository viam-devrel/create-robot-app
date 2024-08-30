#!/usr/bin/env node

import { Command } from "commander";
// import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { exec } from "child_process/promises";

const program = new Command();

program
  .version("1.0.0")
  .description("Create Robot App - A CLI tool to scaffold a new robot project");

// Define the "create" command with a required argument for the project name
program
  .arguments("<projectName>")
  .description("Create a new robot project")
  .action(async (projectName) => {
    console.log(chalk.green(`Creating project: ${projectName}`));

    // Create the directory
    const projectPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
      console.log(
        chalk.red(`Error: Directory "${projectName}" already exists.`)
      );
      process.exit(1);
    }

    fs.mkdirSync(projectPath);

    // Write the package.json file
    const packageJsonContent = {
      name: projectName,
      version: "1.0.0",
      scripts: {
        start: "vite",
        build: "vite build",
        preview: "vite preview",
        test: 'echo "Error: no test specified" && exit 1',
      },
      license: "ISC",
      devDependencies: {
        esbuild: "*",
        typescript: "^5.5.4",
        vite: "^5.4.2",
      },
      dependencies: {
        "@viamrobotics/sdk": "*",
      },
    };

    fs.writeFileSync(
      path.join(projectPath, "package.json"),
      JSON.stringify(packageJsonContent, null, 2)
    );

    // Write a .gitignore file with node_modules, .env
    const gitignoreContent = `node_modules \n.env`;

    fs.writeFileSync(path.join(projectPath, ".gitignore"), gitignoreContent);

    // Write a main.ts file
    const mainTsContent = `// This code must be run in a browser environment.

import * as VIAM from "@viamrobotics/sdk";

const MACHINE_ADDRESS = import.meta.env.VITE_MACHINE_ADDRESS;
const API_KEY = import.meta.env.VITE_API_KEY;
const API_KEY_ID = import.meta.env.VITE_API_KEY_ID;

// This function moves a base component in a square.
async function moveInSquare(client: VIAM.RobotClient) {
  // Replace with the name of the base on your machine.
  const name = "viam_base";
  const baseClient = new VIAM.BaseClient(client, name);

  try {
    button().disabled = true;
    for (let i = 0; i < 4; i++) {
      console.log("move straight");
      await baseClient.moveStraight(500, 500);
      console.log("spin 90 degrees");
      await baseClient.spin(90, 100);
    }
  } finally {
    button().disabled = false;
  }
}

// This function gets the button element
function button() {
  return <HTMLButtonElement>document.getElementById("main-button");
}

const main = async () => {
  const host = MACHINE_ADDRESS;

  const machine = await VIAM.createRobotClient({
    host,
    credential: {
      type: "api-key",
      payload: API_KEY,
    },
    authEntity: API_KEY_ID,
    signalingAddress: "https://app.viam.com:443",
  });

  button().onclick = async () => {
    await moveInSquare(machine);
  };
  button().disabled = false;
};

main().catch((error) => {
  console.error("encountered an error:", error);
});`;

    fs.mkdirSync(path.join(projectPath, "src"));
    fs.writeFileSync(path.join(projectPath, "src", "main.ts"), mainTsContent);

    // Write an index.html file
    const htmlContent = `<!doctype html>
<html>
  <head>
    <title>Drive a Rover</title>
    <link rel="icon" href="favicon.ico" />
  </head>
  <body>
    <div id="main">
      <button id="main-button" disabled="true">Click me</button>
    </div>
    <script type="module" src="src/main.ts"></script>
  </body>
</html>`;

    fs.writeFileSync(path.join(projectPath, "index.html"), htmlContent);

    // Write a .env template with default environment variables
    const envContent = `VITE_MACHINE_ADDRESS="yourMachineUri"
VITE_API_KEY="yourApiKey" 
VITE_API_KEY_ID="yourApiKeyId"`;

    fs.writeFileSync(path.join(projectPath, ".env"), envContent);

    await exec(`npm install`, { cwd: project });

    console.log(chalk.blue(`Project "${projectName}" setup complete!`));
    console.log(chalk.magenta(`  cd ${projectName}`));
    console.log(
      chalk.yellow(
        `  # Update your .env file with your machine credentials from the CONNECT page of the VIAM app`
      )
    );
    console.log(chalk.magenta(`  npm start`));
  });

// Parse the command-line arguments
program.parse(process.argv);
