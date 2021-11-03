import config, { IConfig } from "config";
import mongoose, { ConnectOptions, Mongoose } from "mongoose";

const dbConfig: IConfig = config.get("App.database");

export default class Database {
  async connect(): Promise<Mongoose> {
    const uri: string = dbConfig.get("mongoUrl");
    const options: ConnectOptions = {};
    return mongoose.connect(uri, options);
  }

  async close(): Promise<void> {
    await mongoose.connection.close();
  }
}
