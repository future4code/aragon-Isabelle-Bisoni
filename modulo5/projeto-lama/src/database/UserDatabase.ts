import { IUserDB, User } from '../models/User';
import { BaseDatabase } from './BaseDatabase';

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = 'Lama_Users';

  public async createUser(user: User) {
    const userDB: IUserDB = {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      role: user.getRole(),
    };

    await BaseDatabase.connection(UserDatabase.TABLE_USERS).insert(userDB);
  }

  public findByEmail = async (email: string): Promise<IUserDB | undefined> => {
    const usersDB: IUserDB[] = await BaseDatabase.connection(
      UserDatabase.TABLE_USERS
    )
      .select()
      .where({ email });

    return usersDB[0];
  };
}
