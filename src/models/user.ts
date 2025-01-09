import { model, Schema, Types } from 'mongoose'
import { accountSchema } from './account'

export interface IUser {
  name: string
  password: string
  accountId: Types.ObjectId | typeof accountSchema
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  accountId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Account'
  }
})

export default model('User', userSchema)
