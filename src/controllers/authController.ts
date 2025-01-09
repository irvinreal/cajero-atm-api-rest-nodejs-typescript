import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { CustomRequest } from '../interface'
import Account from '../models/account'
import User from '../models/user'
import { findUser } from '../services/db/findUser'
import { createUser } from '../services/db/createUser'
import { comparePassword, hashPassword } from '../services/password.service'
import account from '../models/account'
import { findUserById } from '../services/db/findUserById'
import { findAccountById } from '../services/db/findAccountById'

type UserResponse = Response | undefined

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let { name, password, amount = 0 } = req.body
  if (amount === '') amount = 0

  try {
    if (!name || !password) {
      return res.status(400).json({ error: 'Faltan campos por llenar.' })
    }

    const hashedPassword = await hashPassword(password)

    const newUser = {
      name: name,
      password: hashedPassword,
      amount: amount
    }
    
    await createUser(newUser)

    return res.status(201).json({
      amount: parseFloat(newUser.amount),
      message: 'Nueva cuenta creada satisfactoriamente.'
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(200).json({ error: 'Este cliente ya fue registrado.' })
    }
    if (error.message === 'User already exist.') {
      return res
        .status(400)
        .json({ error: 'El usuario que intenta crear ya existe.' })
    }
    return res.status(500).json({ error: 'Hubo un error. Intente más tarde..', message: error.meesage })
  }
}

export const login = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  const { name, password } = req.body

  try {
    const user = await findUser(name, password)
    if (!user) {
      return res.status(404).json({ error: 'Cuenta incorrecta.' })
    }

    const isEqual = await comparePassword(password, user.password)

    if (!isEqual) return res.status(401).json({ message: 'Incorrect password'})

    const token = jwt.sign(
      {
        name: user.name,
        userId: user.userId.toString(),
        accountId: user.accountId.toString()
      },
      'secret-key',
      {
        expiresIn: 1000 * 60 * 3
      }
    )

    return res.status(200).json({
      message: 'Bievenido a tu cuenta.',
      name: user.name,
      token,
      userId: user.userId.toString()
    })
  } catch (error) {
    console.log(error)
  }
}

export const getUserInfo = async (
  req: CustomRequest,
  res: Response
): Promise<UserResponse> => {
  const { accountId, userId } = req
  if (!userId || !accountId) return
  
  try {
    // Todo: Agregar historial de movimientos
    const user = await findUserById(userId)
    const userAccount = await findAccountById(accountId)

    return res.status(200).json({
      accountId: userAccount.accountId,
      clientName: user.name,
      account: userAccount
    })
  } catch (error) {
    console.log(error)
  }
}
