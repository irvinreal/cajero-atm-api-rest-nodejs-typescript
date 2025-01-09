import { AccountModel } from "../../types";
import { readFile } from "./dataManager";

export async function findAccountById(id: string): Promise<AccountModel> {
  const data = await readFile('account.json')
  return data.filter((item: AccountModel) => item.accountId === id)[0] 
}