import { warn } from "@tsmodule/log";
import prompts from "prompts";
import { AUTH0_CLIENT } from "../globs/node";

export const authorizeCommand = async () => {
  const { choice } = await prompts({
    name: "choice",
    type: "select",
    message: "Do you already have an authorization code, or would you like to generate one?",
    choices: [
      {
        title: "Enter Code",
        value: "enter",
        description: "Paste an existing authorization code.",
      },

      {
        title: "Generate Code",
        value: "generate",
        description: "You'll paste this when you see this screen on your SSH machine.",
      },
    ],
  });

  switch (choice) {
    case "enter":
      const { code } = await prompts({
        name: "code",
        type: "text",
        message: "Enter your authorization code:",
      });

      await AUTH0_CLIENT.login(code);
      warn("Logged in.", ["bold", "green"], { preLines: 1 });
      break;

    case "generate":
      await AUTH0_CLIENT.authorize();
      break;
  }
};