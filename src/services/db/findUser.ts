import { AccountModel, UserModel } from "../../types"
import { comparePassword } from "../password.service"
import { readFile } from "./dataManager"

export async function findUser(
  inputName: string,
  inputPassword: string
): Promise<UserModel> {
  // bring info from db
  const resUsers = await readFile('user.json')
  // const resAccounts = await readFile('account.json')

  // check if newUser already exists
  const user = resUsers.filter((user: UserModel) => user.name === inputName)[0]

  // let userAccount
    // find user account
    // userAccount = resAccounts.filter(
    //   (account: AccountModel) => account.accountId === user.accountId
    // )[0]

  // return UserInfo
  return user
}