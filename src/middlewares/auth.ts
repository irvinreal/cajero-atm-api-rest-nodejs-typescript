import { Response } from 'express'
import jwt from 'jsonwebtoken'

import { CustomRequest } from '../interface'

interface DecodedToken {
  name: string
  userId: string
  accountId: string
  iat: number // Fecha de emisión (issued at)
  exp: number // Fecha de expiración (expiry)
}

export const auth = (req: CustomRequest, res: Response, next: VoidFunction) => {
  const authHeader = req.get('Authorization')
  let decodedToken

  if (!authHeader) {
    res.status(401).json({ message: 'Faltan permisos de autorización.' })
    return next()
  }

  const token = authHeader.split(' ')[1]

  try {
    decodedToken = jwt.verify(token, 'secret-key') as DecodedToken
  } catch (error) {
    res.status(500).json({ message: 'Credenciales incorrectas.' })
    return next()
  }
  if (!decodedToken) {
    res.status(500).json({ message: 'Error de autenticación.' })
    return next()
  }

  req.accountId = decodedToken.accountId
  req.userId = decodedToken.userId

  next()
}
