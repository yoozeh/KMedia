export interface IKUserPersonal {
  name?: string;
  birth?: Date;
  gender?: number;
  toJSON?(): any;
}

export class KUserPersonal implements IKUserPersonal {

  protected _name: string;
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  protected _birth: Date;
  get birth(): Date {
    return this._birth;
  }
  set birth(value: Date) {
    if (value) {
      this._birth = new Date(value.toLocaleDateString());
    } else {
      this._birth = value;
    }
  }

  protected _gender: number;
  get gender(): number {
    return this._gender;
  }
  set gender(value: number) {
    if (value && (value !== 0 && value !== 1 && value !== -1)) {
      throw 'Invalid gender';
    }
    this._gender = value;
  }

  constructor(privacy?: IKUserPersonal) {
    if (privacy) {
      if (privacy.name) {
        this.name = privacy.name;
      }
      if (privacy.birth) {
        this.birth = privacy.birth;
      }
      if (privacy.gender) {
        this.gender = privacy.gender;
      }
    }
  }

  public toJSON(): any {
    let result: any = {};
    if (this.name) {
      result = { ...result, "name": this.name };
    }
    if (this.birth) {
      result = { ...result, "birth": this.birth.toLocaleDateString() };
    }
    if (this.gender) {
      result = { ...result, "gender": this.gender };
    }
    return result;
  }

}
