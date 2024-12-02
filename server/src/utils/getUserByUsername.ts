import { corbadoSDK } from "./corbado";

export default async function getUserByUsername(username: string) {
  try {
    const user = (
      await corbadoSDK.identifiers().listByValueAndType(username, "username")
    ).identifiers[0].userID;
    console.log(`the user is`, user);
    return user;
  } catch (e) {
    console.error(`Failed getting the user`, e);
  }
}
