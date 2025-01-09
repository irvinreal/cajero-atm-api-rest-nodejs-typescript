import { Response } from 'express'

import Account from '../models/account'
import User from '../models/user'

import { CustomRequest } from '../interface'
import { findAccountById } from '../services/db/findAccountById'
import { updateAccountById } from '../services/db/updateAccountById'

export const deposit = async (
  req: CustomRequest,
  res: Response
): Promise<Response | undefined> => {
  let { amount } = req.body
  const { accountId, userId } = req
  if (!accountId || !userId) return
  amount = parseFloat(amount)

  if (!amount) return res.status(400).json({ message: 'Ingresar cantidad' })

  const account = await findAccountById(accountId)

  if (!account)
    return res
      .status(404)
      .json({ message: 'No hay una cuenta relacionada con este cliente.' })

  const newAmount = account.amount + amount

  const newAccount = await updateAccountById(accountId, {
    accountId,
    userId,
    amount: newAmount
  })

  return res
    .status(200)
    .json({ message: 'Deposito exitoso.', amount: newAccount.amount })
}

export const withdraw = async (
  req: CustomRequest,
  res: Response
): Promise<Response | undefined> => {
  let { amount } = req.body
  const { accountId, userId } = req
  if (!accountId || !userId) return

  amount = parseFloat(amount)

  if (!amount) return res.status(400).json({ message: 'Ingresar cantidad' })

  const account = await findAccountById(accountId)
  if (!account)
    return res
      .status(404)
      .json({ message: 'No hay una cuenta relacionada con este cliente.' })

  // Verificar que el cliente cuente con dinero suficiente para poder realizar el retiro de la cantidad solicitada
  if (account.amount < amount) {
    return res.status(400).json({
      message: 'No cuenta con saldo suficiente para realizar el retiro.'
    })
  }

  // Actualizar la cantidad restante después del retiro
  const newAmount = account.amount - amount
  const newAccount = await updateAccountById(accountId, {
    accountId,
    userId,
    amount: newAmount
  })

  return res
    .status(200)
    .json({ message: 'Retiro exitoso.', amount: newAccount })
}

export const transfer = async (
  req: CustomRequest,
  res: Response
): Promise<Response | undefined> => {
  let { amount, accountToTransfer } = req.body
  const { accountId, userId } = req
  if (!accountId || !userId) return

  amount = parseFloat(amount)

  if (!amount) return res.status(400).json({ message: 'Ingresar cantidad.' })
  if (!accountToTransfer)
    return res.status(400).json({ message: 'Ingrese una cuenta de destino.' })

  //* retirar dinero de la cuenta del cliente que envia
  const accountEmisor = await findAccountById(accountId)
  console.log(accountEmisor)


  //* Verificar que el cliente cuente con dinero suficiente para poder realizar el retiro de la cantidad solicitada
  if (accountEmisor.amount < amount) {
    return res.status(400).json({
      message: 'No cuenta con saldo suficiente para realizar el retiro.'
    })
  }

  //* Actualizar la cantidad restante después del retiro en la cuenta del cliente emisor
  const newAmountEmisor = accountEmisor.amount - amount
  const updatedAccountEmisor = await updateAccountById(accountId, {
    accountId,
    userId,
    amount: newAmountEmisor
  })

  //* cuenta del cliente que recibe
  const accountReceptor = await findAccountById(accountToTransfer)
  console.log(accountReceptor)

  //* Actualizar la cantidad restante después del retiro en la cuenta del cliente receptor
  const newAmountReceptor = accountReceptor.amount + amount
  console.log(amount, accountToTransfer, newAmountReceptor)
  const updatedAccountReceptor = await updateAccountById(accountToTransfer, {
    accountId: accountToTransfer,
    userId: accountReceptor.userId,
    amount: newAmountReceptor
  })

  return res
    .status(200)
    .json({
      message: 'Transferencia exitosa.',
      updatedAccountEmisor,
      updatedAccountReceptor
    })
}
