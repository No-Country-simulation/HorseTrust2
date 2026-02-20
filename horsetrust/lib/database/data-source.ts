import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Address } from "./entities/Address";
import { Horse } from "./entities/Horse";
import { Document } from "./entities/Document";
import { Chat } from "./entities/Chat";
import { Message } from "./entities/Message";
import { Sale } from "./entities/Sale";
import { Review } from "./entities/Review";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: true,
  logging: true,
  entities: [
    User,
    Address,
    Horse,
    Document,
    Chat,
    Message,
    Sale,
    Review,
  ],
});
