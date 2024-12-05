import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

import { CustomRequest } from '../interface'
import Account from '../models/account'
import User from '../models/user'

// import { UserResponse } from '../types'

import { comparePassword, hashPassword } from '../services/password.service'

type UserResponse = Response | undefined

export const register = async (req: Request, res: Response): Promise<Response> => {
  let { name, password, amount = 0 } = req.body

  if (amount === '') {
    amount = 0
  }

  try {
    if (!name || !password) {
      return res.status(400).json({ error: 'Faltan campos por llenar.' })
    }

    const userExists = await User.findOne({ name })

    if (userExists) {
      console.log(userExists)
      return res.status(400).json({ error: 'Este cliente ya fue registrado.' })
    }

    const hashedPassword = await hashPassword(password)

    const userId = new mongoose.Types.ObjectId()
    console.log(userId)

    const userAccount = new Account({
      user: userId,
      amount: amount,
    })

    const user = new User({
      name,
      password: hashedPassword,
      accountId: userAccount._id,
    })
    user._id = userId

    const userAccountDB = await userAccount.save()

    const userDB = await user.save()

    console.log({
      user: userDB,
      account: userAccountDB,
    })

    return res.status(201).json({
      name: userDB.name,
      amount: parseFloat(userAccountDB.amount.toString()),
      message: 'Nueva cuenta creada satisfactoriamente.',
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('Este cliente ya fue registrado.')
      return res.status(200).json({ error: 'Este cliente ya fue registrado.' })
    }
    console.log(error)
    return res.status(500).json({ error: 'Hubo un error. Intente más tarde..' })
  }
}

export const login = async (req: Request, res: Response): Promise<Response | undefined> => {
  const { name, password } = req.body

  try {
    const user = await User.findOne({ name })
    if (!user) {
      return res.status(404).json({ error: 'Cuenta incorrecta.' })
    }

    const isEqual = await comparePassword(password, user.password)
    if (!isEqual) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' })
    }

    console.log(user)

    const token = jwt.sign(
      { name: user.name, userId: user._id.toString(), accountId: user.accountId.toString() },
      'secret-key',
      {
        expiresIn: 1000 * 60 * 5,
      },
    )

    return res.status(200).json({
      message: 'Bievenido a tu cuenta.',
      name: user.name,
      token,
      userId: user._id.toString(),
    })
  } catch (error) {
    console.log(error)
  }
}

export const getUserInfo = async (req: CustomRequest, res: Response): Promise<UserResponse> => {
  // const { userId } = req.body
  const { accountId } = req

  // if (!userId) {
  //   return res.status(401).json({ message: "Falta 'userId'" })
  // }

  try {
    const accountDB = await Account.findById(accountId).populate('user', 'name')
    if (!accountDB)
      return res.status(404).json({ message: 'No existe una cuenta relacionada con este cliente.' })

    // Todo: Agregar historial de movimientos

    console.log(accountDB)
    return res.status(200).json({
      client: accountDB?.user,
      amount: parseFloat(accountDB?.amount.toString()),
    })
  } catch (error) {
    console.log(error)
  }
}
