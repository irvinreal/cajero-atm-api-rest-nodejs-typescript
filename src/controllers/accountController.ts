import { Response } from 'express'

import Account from '../models/account'
import User from '../models/user'

import { CustomRequest } from '../interface'

export const deposit = async (req: CustomRequest, res: Response): Promise<Response> => {
  let { amount } = req.body
  const { accountId } = req
  amount = parseFloat(amount)

  if (!amount) return res.status(400).json({ message: 'Ingresar cantidad' })

  const accountDB = await Account.findById(accountId)
  if (!accountDB)
    return res.status(404).json({ message: 'No hay una cuenta relacionada con este cliente.' })

  const parsedAmount = parseFloat(accountDB.amount.toString())

  const newAmount = parsedAmount + amount

  const amountUpdated = await Account.findByIdAndUpdate(
    accountId,
    { amount: newAmount },
    { returnDocument: 'after' },
  )
  if (!amountUpdated) return res.status(500).json({ message: 'Error al retirar en la DB.' })

  const parsedAmountUpdated = parseFloat(amountUpdated.amount.toString())

  return res.status(200).json({ message: 'Deposito exitoso.', amount: parsedAmountUpdated })
}

export const withdraw = async (req: CustomRequest, res: Response): Promise<Response> => {
  let { amount } = req.body
  const { accountId } = req

  amount = parseFloat(amount)

  if (!amount) return res.status(400).json({ message: 'Ingresar cantidad' })

  const accountDB = await Account.findById(accountId)
  if (!accountDB)
    return res.status(404).json({ message: 'No hay una cuenta relacionada con este cliente.' })

  const parsedAmount = parseFloat(accountDB.amount.toString())

  // Verificar que el cliente cuente con dinero suficiente para poder realizar el retiro de la cantidad solicitada
  if (parsedAmount < amount) {
    return res
      .status(400)
      .json({ message: 'No cuenta con saldo suficiente para realizar el retiro.' })
  }

  // Actualizar la cantidad restante después del retiro
  const newAmount = parsedAmount - amount
  const amountUpdated = await Account.findByIdAndUpdate(
    accountId,
    { amount: newAmount },
    { returnDocument: 'after' },
  )
  if (!amountUpdated) return res.status(500).json({ message: 'Error al retirar en la DB.' })

  const parsedAmountUpdated = parseFloat(amountUpdated.amount.toString())

  return res.status(200).json({ message: 'Retiro exitoso.', amount: parsedAmountUpdated })
}

export const transfer = async (req: CustomRequest, res: Response): Promise<Response> => {
  let { amount, userToTransfer } = req.body
  const { accountId } = req

  amount = parseFloat(amount)

  console.log(amount, userToTransfer)

  if (!amount) return res.status(400).json({ message: 'Ingresar cantidad.' })
  if (!userToTransfer) return res.status(400).json({ message: 'Ingrese una cuenta de destino.' })

  const accountDBEmisor = await Account.findById(accountId)
  if (!accountDBEmisor)
    return res.status(404).json({ message: 'No hay una cuenta relacionada con este cliente.' })

  const parsedAmountEmisor = parseFloat(accountDBEmisor.amount.toString())

  // Verificar que el cliente cuente con dinero suficiente para poder realizar el retiro de la cantidad solicitada
  if (parsedAmountEmisor < amount) {
    return res
      .status(400)
      .json({ message: 'No cuenta con saldo suficiente para realizar el retiro.' })
  }

  // Verificar que el cliente que recibe existe
  const userDBReceptor = await User.findById(userToTransfer)
  if (!userDBReceptor)
    return res.status(404).json({ message: 'No hay una cuenta relacionada con este cliente.' })
  const accountDBReceptor = await Account.findById(userDBReceptor.accountId.toString())
  if (!accountDBReceptor)
    return res.status(404).json({ message: 'No hay una cuenta relacionada con este cliente.' })

  const parsedAmountReceptor = parseFloat(accountDBReceptor.amount.toString())

  // Actualizar la cantidad restante después del retiro en la cuenta del cliente emisor
  const newAmountEmisor = parsedAmountEmisor - amount
  const amountUpdatedEmisor = await Account.findByIdAndUpdate(
    accountId,
    { amount: newAmountEmisor },
    { returnDocument: 'after' },
  )
  if (!amountUpdatedEmisor) return res.status(500).json({ message: 'Error al retirar en la DB.' })

  const parsedAmountUpdatedEmisor = parseFloat(amountUpdatedEmisor.amount.toString())

  // Actualizar la cantidad restante después del retiro en la cuenta del cliente que recibe
  const newAmountReceptor = parsedAmountReceptor + amount
  const amountUpdatedReceptor = await Account.findByIdAndUpdate(
    userDBReceptor.accountId.toString(),
    { amount: newAmountReceptor },
    { returnDocument: 'after' },
  )
  if (!amountUpdatedReceptor) return res.status(500).json({ message: 'Error al retirar en la DB.' })

  const parsedAmountUpdatedReceptor = parseFloat(amountUpdatedReceptor.amount.toString())

  console.log('Cuenta emisor: ', parsedAmountEmisor, ' -> ', parsedAmountUpdatedEmisor)
  console.log('Cuenta receptor: ', parsedAmountReceptor, ' -> ', parsedAmountUpdatedReceptor)

  return res.status(200).json({ message: 'Transferencia exitosa.' })
}
