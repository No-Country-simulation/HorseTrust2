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

// Turbopack/webpack minifica los nombres de clase en producción, lo que rompe
// los metadatos de TypeORM (e.g. Address → d, User → u).
// Object.defineProperty fuerza el nombre original en el bundle minificado.
Object.defineProperty(User, "name", { value: "User" });
Object.defineProperty(Address, "name", { value: "Address" });
Object.defineProperty(Horse, "name", { value: "Horse" });
Object.defineProperty(Document, "name", { value: "Document" });
Object.defineProperty(Chat, "name", { value: "Chat" });
Object.defineProperty(Message, "name", { value: "Message" });
Object.defineProperty(Sale, "name", { value: "Sale" });
Object.defineProperty(Review, "name", { value: "Review" });

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: false,
  synchronize: true,
  logging: true,
  entities: [User, Address, Horse, Document, Chat, Message, Sale, Review],
});
