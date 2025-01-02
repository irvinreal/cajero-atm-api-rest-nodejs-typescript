import Account from '../models/account'

export const getAmount = async (id: string) => {
  try {
    const account = await Account.findById(id)
    if (!account) {
      throw new Error('User not found')
    }
    return account.amount
  } catch (error) {
    console.log(error)
  }
}
