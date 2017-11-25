import * as mongo from 'mongodb';

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

  private _query(traget: string, data: any, fn: (collection: mongo.Collection, data?: any) => void) {
    let database: mongo.Db;
    mongo.MongoClient.connect(this.uri).then((db) => {
      database = db;
      return db.createCollection(traget, { autoIndexId: true });
    }).then((collection) => {
      fn(collection, data);
      database.close();
    }).catch((error) => {
      throw error;
    });
  }

  public insert(traget: string, data: any) {
    this._query(traget, data, (collection: mongo.Collection, data: any) => {
      collection.insert(data);
    });
  }

}
