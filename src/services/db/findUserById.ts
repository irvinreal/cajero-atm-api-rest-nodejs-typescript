import { UserModel } from "../../types";
import { readFile } from "./dataManager";

export async function findUserById(id: string): Promise<UserModel> {
  const data = await readFile('user.json')
  return data.filter((item: UserModel) => item.userId === id)[0]
}