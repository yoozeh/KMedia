import * as mongo from 'mongodb';
import { Cursor } from 'mongodb';

export class Database {

  private uri: string;

  constructor(json: string) {
    if (json) {
      let db = require(json);
      switch (db.source) {
        case 'json':
          this.uri = 'mongodb://' +
            db.user + ':' +
            db.password + '@' +
            db.host + '/' +
            db.name;
          break;
        case 'env':
          this.uri = 'mongodb://' +
            process.env[db.user] + ':' +
            process.env[db.password] + '@' +
            process.env[db.host] + '/' +
            process.env[db.name];
          break;
        default:
          throw 'Unknown';
      }
    }
  }

  private _database: mongo.Db = null;

  public async connect(reconnect?: boolean): Promise<void> {
    try {
      if (!this._database || (this._database && reconnect)) {
        this._database = await mongo.MongoClient.connect(this.uri);
      }
    } catch (error) {
      throw error;
    }
  }

  public disconnect(): void {
    if (this._database) {
      this._database.close();
      this._database = null;
    }
  }

  public count(target: string, query: any): Promise<number> {
    if (!this._database) {
      throw 'Database error';
    }
    return this._database.collection(target).count(query)
  }

  public find(target: string, query: any): Cursor<any> {
    if (!this._database) {
      throw 'Database error';
    }
    return this._database.collection(target).find(query);
  }

  public insert(target: string, data: any): Promise<mongo.InsertOneWriteOpResult> {
    if (!this._database) {
      throw 'Database error';
    }
    return this._database.collection(target).insert(data);
  }

}
