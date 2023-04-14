import UserModel from '@/models/user';
import { IUser, IUserInputDTO } from '@/interfaces/IUser';
import { Service } from 'typedi';

@Service()
export class UserRepository {
  constructor() {}

  public findUserByEmail = async (email: IUser['email']) => {
    try {
      const user = await UserModel.findOne({ email }).lean();
      return user;
    } catch (error) {
      throw error;
    }
  };

  public findUserByUsername = async (username: IUser['username']): Promise<IUser> => {
    try {
      const user = await UserModel.findOne({ username }).lean();
      return user;
    } catch (error) {
      throw error;
    }
  };

  public updatePasswordByUsername = async (
    username: IUser['username'],
    salt: IUser['salt'],
    password: IUser['password'],
  ): Promise<IUser> => {
    return UserModel.update({ salt, password }, { where: { username }, returning: true }).then(async updatedResult => {
      const affectedRow = updatedResult[1];
      if (affectedRow) return await UserModel.findOne({ where: { username } }).then(result => result.toJSON());
    });
  };

  public createUser = async (userInputDTO: IUserInputDTO, salt: IUser['salt'], password: IUser['password']) => {
    try {
      const user = await UserModel.create({
        ...userInputDTO,
        salt,
        password,
      });
      if (user) {
        return user.toObject();
      }
      return null;
    } catch (error) {
      throw 'User cannot be created';
    }
  };

  public updatePasswordById = async (userId: IUser['_id'], salt: IUser['salt'], password: IUser['password']) => {
    return UserModel.findOneAndUpdate({ _id: userId }, { $set: { salt, password } }, { new: true }, (err, doc) => {
      if (err) throw err;
      return doc.toObject();
    });
  };
}
