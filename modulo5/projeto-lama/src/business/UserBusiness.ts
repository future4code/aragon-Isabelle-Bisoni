import { UserDatabase } from '../database/UserDatabase';
import { ConflictError } from '../errors/ConflictError';
import { NotFoundError } from '../errors/NotFoundError';
import { RequestError } from '../errors/RequestError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import {
  ILoginInputDTO,
  ISignupInputDTO,
  User,
  USER_ROLES,
} from '../models/User';
import { Authenticator, ITokenPayload } from '../services/Authenticator';
import { HashManager } from '../services/HashManager';
import { IdGenerator } from '../services/IdGenerator';

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private hashManager: HashManager,
    private authenticator: Authenticator
  ) {}

  public async signup(input: ISignupInputDTO) {
    const name = input.name;
    const email = input.email;
    const password = input.password;

    if (!name || !email || !password) {
      throw new Error(
        'One or more missing params. Must insert: name, email and password'
      );
    }

    if (typeof name !== 'string' || name.length < 3) {
      throw new RequestError(
        'Name must be string type, with more than 3 characters'
      );
    }

    if (typeof password !== 'string' || password.length < 6) {
      throw new RequestError(
        'Password must be string type, with more than 6 characters.'
      );
    }

    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      ) ||
      typeof email !== 'string'
    ) {
      throw new RequestError('Invalid e-mail');
    }

    const searchUser = await this.userDatabase.findByEmail(email);

    if (searchUser) {
      throw new ConflictError('E-mail already have an account');
    }

    const id = this.idGenerator.generate();
    const hashedPassword = await this.hashManager.hash(password);

    const newUser = new User(
      id,
      name,
      email,
      hashedPassword,
      USER_ROLES.NORMAL
    );

    await this.userDatabase.createUser(newUser);

    const payload: ITokenPayload = {
      id: newUser.getId(),
      role: newUser.getRole(),
    };

    const token = this.authenticator.generateToken(payload);

    const response = {
      message: 'User created successfully!',
      token,
    };

    return response;
  }

  public async login(input: ILoginInputDTO) {
    const email = input.email;
    const password = input.password;

    if (!email || !password) {
      throw new RequestError('Missing params. Insert email and password.');
    }

    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      ) ||
      typeof email !== 'string'
    ) {
      throw new RequestError('Invalid e-mail');
    }

    if (typeof password !== 'string' || password.length < 6) {
      throw new RequestError(
        'Password must be string type and have at least 6 characters'
      );
    }

    const searchUser = await this.userDatabase.findByEmail(email);

    if (!searchUser) {
      throw new NotFoundError('E-mail not found');
    }

    const user = new User(
      searchUser.id,
      searchUser.name,
      searchUser.email,
      searchUser.password,
      searchUser.role
    );

    const isPasswordCorrect = await this.hashManager.compare(
      password,
      user.getPassword()
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedError('Incorrect password.');
    }

    const payload: ITokenPayload = {
      id: user.getId(),
      role: user.getRole(),
    };

    const token = this.authenticator.generateToken(payload);

    const response = {
      message: "You're logged",
      token,
    };

    return response;
  }
}
