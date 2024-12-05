import User from '../models/user'

export const getAmount = async (id: string) => {
  try {
    const user = await User.findById(id)
    return user?.amount ? parseFloat(user.amount.toString()) : 0
  } catch (error) {
    console.log(error)
  }
}
