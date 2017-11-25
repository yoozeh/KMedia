import { IKUserAccount, KUserAccount } from './/k-user-account';
import { IKUserPersonal, KUserPersonal } from './/k-user-personal';
import { KFields } from './/k-fields';

export interface IKUser {
  account: IKUserAccount;
  personal?: IKUserPersonal;
  fields?: any;
  toJSON?(): any;
}

export class KUser extends KFields implements IKUser {

  protected _account: KUserAccount;
  get account(): IKUserAccount {
    return this._account.toJSON();
  }
  set account(value: IKUserAccount) {
    this._account = new KUserAccount(value);
  }

  protected _personal: KUserPersonal;
  get personal(): IKUserPersonal {
    return this._personal.toJSON();
  }
  set personal(value: IKUserPersonal) {
    this._personal = new KUserPersonal(value);
  }

  protected _fields: KUserPersonal;
  get fields(): any {
    return JSON.parse(JSON.stringify(this._fields));
  }
  set fields(value: any) {
    this._fields = JSON.parse(JSON.stringify(value));
  }

  constructor(user?: IKUser) {
    super();
    if (user) {
      if (user.account) {
        this.account = user.account;
      }
      if (user.personal) {
        this.personal = user.personal;
      }
      if (user.fields) {
        this.fields = user.fields;
      }
    }
  }

  public setField(value: any) {
    this._fields = { ...this._fields, ...JSON.parse(JSON.stringify(value)) }
  }

  public removeField(value: string) {
    delete this._fields[value];
  }

  public toJSON(): any {
    let result: any = {};
    if (this.account) {
      result = { ...result, "account": this._account.toJSON() };
    }
    if (this.personal) {
      result = { ...result, "personal": this._personal.toJSON() };
    }
    if (this.fields) {
      result = { ...result, "fields": JSON.parse(JSON.stringify(this._fields)) };
    }
    return result;
  }

}
