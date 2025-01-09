import { AccountModel } from '../../types'
import { readFile, writeFile } from './dataManager'

export async function updateAccountById(id: string, newData: AccountModel) {
  const data = await readFile('account.json')

  // update account
  const newAccountsArr = data.filter(
    (item: AccountModel) => item.accountId !== id
  )
  newAccountsArr.push(newData)

  // rewrite file
  await writeFile('account.json', newAccountsArr)

  const updatedData = await readFile('account.json')
  return updatedData.filter((item: AccountModel) => item.accountId === id)[0]

}
