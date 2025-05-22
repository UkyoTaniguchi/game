import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  database: "game_db",
});
