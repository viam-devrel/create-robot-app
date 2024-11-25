#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);

const program = new Command();
const TEMPLATES_DIR = path.join(__dirname, "templates"); // Directory containing templates

// Function to copy a template and substitute placeholders
const copyTemplate = async (templateName, projectPath, placeholders) => {
  const templatePath = path.join(TEMPLATES_DIR, templateName);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template "${templateName}" not found in ${TEMPLATES_DIR}`);
  }

  // Copy template files
  await fs.copy(templatePath, projectPath);

  // Replace placeholders in specific files
  for (const [filePath, variables] of Object.entries(placeholders)) {
    const absolutePath = path.join(projectPath, filePath);
    if (fs.existsSync(absolutePath)) {
      let content = await fs.readFile(absolutePath, "utf-8");
      for (const [key, value] of Object.entries(variables)) {
        content = content.replace(new RegExp(`{{${key}}}`, "g"), value);
      }
      await fs.writeFile(absolutePath, content, "utf-8");
    }
  }
};

program
  .version("1.0.0")
  .description("Create Robot App - A CLI tool to scaffold a new robot project");

// Define the "create" command with a required argument for the project name
program.description("Create a new robot project").action(async () => {
  // Step 1: Prompt the user for project details
  const { projectName, templateName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter the project name:",
      validate: (input) => {
        if (!input) return "Project name cannot be empty";
        return true;
      },
      default: "my-viam-project",
    },
    {
      type: "list",
      name: "templateName",
      message: "Select a template:",
      choices: fs.readdirSync(TEMPLATES_DIR), // List all templates
    },
  ]);

  console.log(
    chalk.green(
      `Creating project: ${projectName} using template: ${templateName}`
    )
  );

  // Step 2: Define the project directory
  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`Error: Directory "${projectName}" already exists.`));
    process.exit(1);
  }

  fs.mkdirSync(projectPath);

  // Step 3: Copy the selected template and perform dynamic substitutions (if any)
  await copyTemplate(templateName, projectPath, {
    ".env": {
      MACHINE_ADDRESS: "yourMachineUri",
      API_KEY: "yourApiKey",
      API_KEY_ID: "yourApiKeyId",
    },
  });

  // Step 4: Install dependencies
  console.log(chalk.cyan("Installing dependencies..."));
  await execAsync(`npm install`, { cwd: projectPath });

  console.log(chalk.blue(`Project "${projectName}" setup complete!\n\n`));
  console.log(chalk.cyan(`  cd ${projectName}\n`));
  console.log(
    chalk.cyan(
      `  # NOTE: Update your .env file with your machine credentials from the CONNECT page of the VIAM app 🤖\n`
    )
  );
  console.log(chalk.cyan(`  npm start \n\n`));
});

// Parse the command-line arguments
program.parse(process.argv);

// #!/usr/bin/env node

// import { Command } from "commander";
// import inquirer from "inquirer";
// import chalk from "chalk";
// import fs from "fs";
// import path from "path";
// import { exec } from "child_process";
// import { promisify } from "util";
// const execAsync = promisify(exec);

// const program = new Command();

// program
//   .version("1.0.0")
//   .description("Create Robot App - A CLI tool to scaffold a new robot project");

// // Define the "create" command with a required argument for the project name
// program
//   // .arguments("<projectName>")
//   .description("Create a new robot project")
//   .action(async () => {
//     // Prompt the user for the project name
//     const { projectName } = await inquirer.prompt([
//       {
//         type: "input",
//         name: "projectName",
//         message: "Enter the project name:",
//         validate: (input) => {
//           if (!input) {
//             return "Project name cannot be empty";
//           }
//           return true;
//         },
//         default: "my-viam-project",
//       },
//     ]);
//     console.log(chalk.green(`Creating project: ${projectName}`));

//     // Create the directory
//     const projectPath = path.join(process.cwd(), projectName);

//     if (fs.existsSync(projectPath)) {
//       console.log(
//         chalk.red(`Error: Directory "${projectName}" already exists.`)
//       );
//       process.exit(1);
//     }

//     fs.mkdirSync(projectPath);

//     // Write the package.json file
//     const packageJsonContent = {
//       name: projectName,
//       version: "1.0.0",
//       scripts: {
//         start: "vite",
//         build: "vite build",
//         preview: "vite preview",
//         test: 'echo "Error: no test specified" && exit 1',
//       },
//       license: "ISC",
//       devDependencies: {
//         esbuild: "*",
//         typescript: "^5.5.4",
//         vite: "^5.4.2",
//       },
//       dependencies: {
//         "@viamrobotics/sdk": "*",
//       },
//     };

//     fs.writeFileSync(
//       path.join(projectPath, "package.json"),
//       JSON.stringify(packageJsonContent, null, 2)
//     );

//     // Write a .gitignore file with node_modules, .env
//     const gitignoreContent = `node_modules \n.env`;

//     fs.writeFileSync(path.join(projectPath, ".gitignore"), gitignoreContent);

//     // Write a main.ts file
//     const mainTsContent = `// This code must be run in a browser environment.

// import * as VIAM from "@viamrobotics/sdk";

// const MACHINE_ADDRESS = import.meta.env.VITE_MACHINE_ADDRESS;
// const API_KEY = import.meta.env.VITE_API_KEY;
// const API_KEY_ID = import.meta.env.VITE_API_KEY_ID;

// // This function moves a base component in a square.
// async function moveInSquare(client: VIAM.RobotClient) {
//   // Replace with the name of the base on your machine.
//   const name = "viam_base";
//   const baseClient = new VIAM.BaseClient(client, name);

//   try {
//     button().disabled = true;
//     for (let i = 0; i < 4; i++) {
//       console.log("move straight");
//       await baseClient.moveStraight(500, 500);
//       console.log("spin 90 degrees");
//       await baseClient.spin(90, 100);
//     }
//   } finally {
//     button().disabled = false;
//   }
// }

// // This function gets the button element
// function button() {
//   return <HTMLButtonElement>document.getElementById("main-button");
// }

// const main = async () => {
//   const host = MACHINE_ADDRESS;

//   const machine = await VIAM.createRobotClient({
//     host,
//     credentials: {
//       type: "api-key",
//       payload: API_KEY,
//       authEntity: API_KEY_ID,
//     },
//     signalingAddress: "https://app.viam.com:443",
//   });

//   button().onclick = async () => {
//     await moveInSquare(machine);
//   };
//   button().disabled = false;
// };

// main().catch((error) => {
//   console.error("encountered an error:", error);
// });`;

//     fs.mkdirSync(path.join(projectPath, "src"));
//     fs.writeFileSync(path.join(projectPath, "src", "main.ts"), mainTsContent);

//     // Write an index.html file
//     const htmlContent = `<!doctype html>
// <html>
//   <head>
//     <title>Drive a Rover</title>
//     <link rel="icon" href="favicon.ico" />
//   </head>
//   <body>
//     <div id="main">
//       <h1>Drive a rover in a square</h1>
//       <p>We recommend you open the developer tools in your browser to see logs.</p>
//       <p>Also open a second window with the <a href="https://app.viam.com">Viam app</a> and navigate to your rover's <b>CONTROL</b> tab, which allows you to interact with your rover's resources. Click on one of the camera panels and toggle the camera stream on so you can observe the rover's movements.</p>
//       <button id="main-button" disabled="true">Click me to drive rover in square</button>
//     </div>
//     <script type="module" src="src/main.ts"></script>
//   </body>
// </html>`;

//     fs.writeFileSync(path.join(projectPath, "index.html"), htmlContent);

//     // Write a .env template with default environment variables
//     const envContent = `VITE_MACHINE_ADDRESS=yourMachineUri
// VITE_API_KEY=yourApiKey
// VITE_API_KEY_ID=yourApiKeyId`;

//     fs.writeFileSync(path.join(projectPath, ".env"), envContent);

//     await execAsync(`npm install`, { cwd: projectName });

//     console.log(chalk.blue(`Project "${projectName}" setup complete!\n\n`));
//     console.log(chalk.cyan(`  cd ${projectName}\n`));
//     console.log(
//       chalk.cyan(
//         `  # NOTE: Update your .env file with your machine credentials from the CONNECT page of the VIAM app 🤖\n`
//       )
//     );
//     console.log(chalk.cyan(`  npm start \n\n`));
//   });

// // Parse the command-line arguments
// program.parse(process.argv);
