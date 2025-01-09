import fs from 'node:fs/promises'
import path from 'node:path'
import { UserModel, AccountModel, Id } from '../../types'

type InsertData = UserModel | AccountModel

export async function readFile(file: string) {
  const data = await fs.readFile(path.join(__dirname, '../../data', file), 'utf8')
  let res
  try {
    res = JSON.parse(data)
  } catch (error) {
    res = []
  }
  return res
}

export async function writeFile(file: string, content: InsertData[]) {
  await fs.writeFile(
    path.join(__dirname, '../../data', file),
    JSON.stringify(content)
  )
}

// Todo: restart data when user close the window
// function restartData(file: string) {
//   fs.writeFileSync(path.join(__dirname, '../data', file), JSON.stringify([]))
// }


export function getAmount(userId: Id) {}

export function setAmount(userId: Id, amount: number) {}

