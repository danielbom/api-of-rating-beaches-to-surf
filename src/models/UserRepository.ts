import Logger from '@src/Logger';
import AuthService from '@src/services/AuthService';
import mongoose, { Document } from 'mongoose';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

export enum CustomValidation {
  DUPLICATED = 'DUPLICATED',
}

interface UserModel extends Omit<User, '_id'>, Document { }

const schema = new mongoose.Schema<UserModel>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        /* eslint-disable */
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        /* eslint-enable */
      },
    },
  },
);

schema.path('email').validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  'already exists in the database.',
  CustomValidation.DUPLICATED,
);

schema.pre<UserModel>('save', async function preSaveUser(): Promise<void> {
  if (this.password && this.isModified('password')) {
    try {
      const hashedPassword = await AuthService.hashPassword(this.password);
      this.password = hashedPassword;
    } catch (err) {
      Logger.error(`Error hashing the password for the user (${this.id}) ${this.name}`, err);
    }
  }
});

schema.virtual('id').get(function getUserId(this: UserModel) {
  // eslint-disable-next-line
  return this._id;
});

const UserRepository = mongoose.model('User', schema);
export default UserRepository;
