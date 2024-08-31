**[Try Viam (borrow a rover)](https://app.viam.com/try)**: Remotely control a Viam Rover in their NYC robotics lab for 10 minutes. Drive it around, explore its configuration, or write code to control it—all from wherever you are.

Follow along with step-by-step instructions: [Drive a rover using TypeScript](https://codelabs.viam.com/guide/drive-rover-ts/index.html?index=..%2F..index#0)

### Get Started

1. From the command line of your terminal window, create a new robot app.
   ```bash
   $ npm create robot-app
   ```
1. At the command-line prompt, input your project name (or leave as default) and hit **Enter**.
1. Navigate in to the new project directory, where `my-viam-project` is the name of your new project.
   ```bash
   $ cd my-viam-project
   ```
1. Update the file `.env` with your own machine credentials from the **CONNECT** page of [the Viam app](https://app.viam.com/robots).
   ![viam machine credentials](https://github.com/loopDelicious/create-robot-app/blob/main/viamMachineCredentials.png)
1. Start the server. Your web app should be running at `http://localhost:5173/`. When the connection to the rover is established, the **Click me** button will become enabled.
   ```bash
   $ npm start
   ```
