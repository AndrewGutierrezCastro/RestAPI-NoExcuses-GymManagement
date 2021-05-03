import mongoose from 'mongoose';
import { UserSchema } from '../model/User';

export class MongoDbConnection {
  public static db: mongoose.Connection;
  private readonly connectionString: string = <string> process.env.MONGO_URI;

  constructor() {
    this.registerModels();
    this.connect();
  }

  private registerModels() {
    mongoose.model('users', UserSchema);
  }

  private connect() {
    mongoose.connect(this.connectionString, {useNewUrlParser: true, useUnifiedTopology: true}).then();
    mongoose.connection.once('open', () => {
      console.log('MongoDB connected!')
    });
    MongoDbConnection.db = mongoose.connection;
  }
}

