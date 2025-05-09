// pages/api/create-room.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { maxPlayers, password, playerName } = req.body;

  if (!maxPlayers || !password || !playerName) {
    return res.status(400).json({ error: "全ての項目を入力してください" });
  }

  const hash = await bcrypt.hash(password, 10);

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [roomResult]: any = await conn.query(
      "INSERT INTO rooms (max_players, password_hash) VALUES (?, ?)",
      [maxPlayers, hash]
    );

    const roomId = roomResult.insertId;

    await conn.query("INSERT INTO players (name, room_id) VALUES (?, ?)", [
      playerName,
      roomId,
    ]);

    await conn.commit();
    res.status(200).json({ roomId });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: "エラーが発生しました" });
  } finally {
    conn.release();
  }
}
