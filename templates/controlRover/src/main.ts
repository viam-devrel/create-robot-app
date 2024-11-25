// This code must be run in a browser environment.

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
    credentials: {
      type: "api-key",
      payload: API_KEY,
      authEntity: API_KEY_ID,
    },
    signalingAddress: "https://app.viam.com:443",
  });

  button().onclick = async () => {
    await moveInSquare(machine);
  };
  button().disabled = false;
};

main().catch((error) => {
  console.error("encountered an error:", error);
});