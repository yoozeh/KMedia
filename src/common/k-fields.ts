export class KFields {

  protected _fields: any;
  get fields(): any {
    return (this._fields) ? JSON.parse(JSON.stringify(this._fields)) : this._fields;
  }
  set fields(value: any) {
    this._fields = JSON.parse(JSON.stringify(value));
  }

  constructor(fields?: any) {
    if (fields) {
      this.fields = fields;
    }
  }

}
