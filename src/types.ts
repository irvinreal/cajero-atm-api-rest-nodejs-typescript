export type UserResponse = Response | undefined

export type Id = string

export interface NewUser {
  name: string
  password: string
  amount: number 
}

export interface UserModel {
  userId: Id
  name: string
  password: string
  accountId: Id
}

export interface AccountModel {
  accountId: Id
  userId: Id
  amount: number
}
