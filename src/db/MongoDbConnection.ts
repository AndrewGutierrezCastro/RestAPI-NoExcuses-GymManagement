import mongoose from 'mongoose';
import { UserSchema } from '../db/schemas/UserSchema';
import { ServiceSchema } from './schemas/ServiceSchema';
import { SessionSchema } from './schemas/SessionSchema';

export class MongoDbConnection {
  
  public static db: mongoose.Connection;
  private readonly connectionString: string = <string> process.env.MONGO_URI;

  constructor() {
    this.registerModels();
    this.connect();
  }

  private registerModels() {
    mongoose.model('users', UserSchema);
    mongoose.model('sessions', SessionSchema);
    mongoose.model('services', ServiceSchema);
  }

  private connect() {
    mongoose.connect(this.connectionString, {useNewUrlParser: true, useUnifiedTopology: true}).then();
    mongoose.connection.once('open', () => {
      console.log('MongoDB connected!')
    });
    MongoDbConnection.db = mongoose.connection;
  }
}

