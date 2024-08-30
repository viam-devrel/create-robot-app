1. From the command line create a new robot app with `npm create robot-app my-project` where `my-project` is the name of your new project. 
    ```bash
    $ npm create robot-app my-project
    ```
1. Change in to the directory with `cd my-project`, install dependencies with `npm install`, and start the server with `npm start`. Your project should be running at `localhost:8000`.
    ```bash
    $ cd my-project
    $ npm install
    $ npm start
    ```
1. Duplicate `.env.template` and rename file `.env`. Copy and paste your own machine credentials from the **CONNECT** page of [the Viam app](https://app.viam.com/robots) into the new `.env` file.
    ```bash
    $ cp .env.template .env
    ```