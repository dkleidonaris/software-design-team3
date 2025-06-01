import { BaseModel } from "./BaseModel";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { Database } from "../utils/db";
import { Filter, Document } from "mongodb";
import { ObjectId } from "mongodb";

type UserProps = {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
};

export class User {
  public id: string = "";
  public name: string = "";
  public email: string = "";
  private password: string = "";
  public age: number = 0;
  public gender: string = "male";
  public weight: number = 0;
  public height: number = 0;

  constructor({
    id,
    name,
    email,
    password,
    age,
    gender,
    weight,
    height,
  }: UserProps) {
    this.id = id ?? "";
    this.name = name ?? "";
    this.email = email ?? "";
    this.password = password ?? "";
    this.age = age ?? 0;
    this.gender = gender ?? "male";
    this.weight = weight ?? 0;
    this.height = height ?? 0;
  }

  static async register(email: string, password: string): Promise<User> {
    const passwordEncrypted = bcrypt.hash(password, 10);
    const user = new User({ email, password });
    const result = await Database.insertOne("users", {
      email: email,
      password: passwordEncrypted,
    });

    user.id = result.insertedId.toString();
    return user;
  }

  public async update(update: {
    name?: string;
    age?: number;
    gender?: string;
    weight?: number;
    height?: number;
    email?: string;
  }) {
    if (Object.keys(update).length === 0) {
      throw new Error("No fields provided to update");
    }

    return await Database.updateOne(
      "users",
      { _id: new ObjectId(this.id) },
      { $set: update }
    );
  }

  public async delete(): Promise<Boolean> {
    const result = await Database.deleteOne("users", {
      _id: new ObjectId(this.id),
    });

    return result.deletedCount === 1;
  }

  public calculateBMR(): Number {
    if (!this.gender || !this.age || !this.weight || !this.height) {
      throw new Error("Missing user data for BMR calculation");
    }

    if (this.gender === "male") {
      return 10 * this.weight + 6.25 * this.height - 5 * this.age + 5;
    } else {
      return 10 * this.weight + 6.25 * this.height - 5 * this.age - 161;
    }
  }
}
