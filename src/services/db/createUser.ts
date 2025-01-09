import { getUUID } from '../../plugin/get-id.plugin'
import { NewUser, UserModel } from '../../types'
import { readFile, writeFile } from './dataManager'

export async function createUser(newUser: NewUser): Promise<UserModel | Error | undefined> {
  // bring info from db
  const resUsers =  await readFile('user.json')
  const resAccounts =  await readFile('account.json')


  // check if newUser already exists
  const user = resUsers.filter(
    (user: UserModel) => user.name === newUser.name
  )[0]

  if (user) {
    throw new Error('User already exist.')
  }

  // generate credentials
  const userId = getUUID()
  const accountId = getUUID()

  // user object to save
  const userToSave = {
    userId: userId,
    name: newUser.name,
    password: newUser.password,
    accountId: accountId
  }

  // account object to save
  const accountToSave = {
    accountId: accountId,
    userId: userId,
    amount: newUser.amount
  }

  const newUsersArr = [...resUsers, userToSave]

  const newAccountsArr = [...resAccounts, accountToSave]
  try {
    writeFile('user.json', newUsersArr)
    writeFile('account.json', newAccountsArr)
    console.log('User created succesfully.')
  } catch (error) {
    console.log('An error ocurred.')
  }
  return 
}
