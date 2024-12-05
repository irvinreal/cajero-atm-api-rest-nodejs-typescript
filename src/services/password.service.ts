import bcrypt from 'bcrypt'
const SALT_ROUNDS: number = 10

// Hashear la contraseña
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

// Comparar contraseña hasheada
export const comparePassword = async (password: string, userPassword: string): Promise<Boolean> => {
  return await bcrypt.compare(password, userPassword)
}
