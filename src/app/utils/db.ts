import mongoose from "mongoose";
import {
  InsertOneResult,
  UpdateResult,
  DeleteResult,
  Document,
  WithId,
  OptionalUnlessRequiredId,
} from "mongodb";

export class Database {
  private static isConnected = false;

  private static async connect(): Promise<void> {
    if (this.isConnected) return;

    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI not found in environment variables");

    await mongoose.connect(uri);
    this.isConnected = true;
    console.log("✅ MongoDB connected");
  }

  public static async getConnection() {
    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      await this.connect();
    }

    const db = mongoose.connection.db;
    if (!db) throw new Error("Failed to get MongoDB connection");

    return db;
  }

  public static async insertOne<T extends Document>(
    collection: string,
    document: OptionalUnlessRequiredId<T>,
    options?: object
  ): Promise<InsertOneResult<T>> {
    const db = await this.getConnection();
    return db.collection<T>(collection).insertOne(document, options);
  }

  public static async updateOne<T extends Document>(
    collection: string,
    filter: object,
    update: object,
    options?: object
  ): Promise<UpdateResult> {
    const db = await this.getConnection();
    return db.collection<T>(collection).updateOne(filter, update, options);
  }

  public static async deleteOne<T extends Document>(
    collection: string,
    filter: object,
    options?: object
  ): Promise<DeleteResult> {
    const db = await this.getConnection();
    return db.collection<T>(collection).deleteOne(filter, options);
  }

  public static async find<T extends Document>(
    collection: string,
    query: object,
    projection?: object,
    options?: object
  ): Promise<WithId<T>[]> {
    const db = await this.getConnection();
    const cursor = db.collection<T>(collection).find(query, options);
    if (projection) cursor.project(projection);
    return cursor.toArray();
  }

  public static async findOne<T extends Document>(
    collection: string,
    query: object,
    projection?: object,
    options?: object
  ): Promise<WithId<T> | null> {
    const db = await this.getConnection();
    return db.collection<T>(collection).findOne(query, {
      ...options,
      projection,
    });
  }
}
