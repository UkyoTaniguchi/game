// lib/db.ts
import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "your_username",
  password: "your_password",
  database: "your_db_name",
});
