import { KRegExp } from './k-reg-exp';

export interface IKUserAccount {
  email?: string;
  password?: string;
  nickname?: string;
  toJSON?(): any;
}

export class KUserAccount implements IKUserAccount {

  protected _email: string;
  get email(): string {
    return this._email;
  }
  set email(value: string) {
    if (!KRegExp.checkEmail(value)) {
      throw 'Invalid email';
    }
    this._email = value;
  }

  protected _password: string;
  get password(): string {
    return this._password;
  }
  set password(value: string) {
    if (!KRegExp.checkPassword(value)) {
      throw 'Invalid password';
    }
    this._password = value;
  }

  protected _nickname: string;
  get nickname(): string {
    return this._nickname;
  }
  set nickname(value: string) {
    if (!KRegExp.checkNickname(value)) {
      throw 'Invalid nickname';
    }
    this._nickname = value;
  }

  constructor(account?: IKUserAccount) {
    if (account) {
      if (account.email) {
        this.email = account.email;
      }
      if (account.password) {
        this.password = account.password;
      }
      if (account.nickname) {
        this.nickname = account.nickname;
      }
    }
  }

  public toJSON(): any {
    let result: any = {};
    if (this.email) {
      result = { ...result, "email": this.email };
    }
    if (this.password) {
      result = { ...result, "password": this.password };
    }
    if (this.nickname) {
      result = { ...result, "nickname": this.nickname };
    }
    return result;
  }

}
