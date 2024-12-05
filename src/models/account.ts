import { model, Schema } from 'mongoose'

interface IAccount {
  user: Schema.Types.ObjectId
  amount: Schema.Types.Decimal128
}

export const accountSchema = new Schema<IAccount>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  amount: {
    type: Schema.Types.Decimal128,
    default: 0,
  },
})

export default model('Account', accountSchema)
