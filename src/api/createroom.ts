import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { playerName, password, maxPlayers } = req.body;
  if (!playerName || !password || !maxPlayers) {
    return res.status(400).json({ error: "全ての項目を入力してください" });
  }

  const hash = await bcrypt.hash(password, 10);

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [roomResult]: any = await conn.query(
      "INSERT INTO rooms (created_by, maxPlayers, password_hash) VALUES (?,?,?)",
      [playerName, maxPlayers, hash]
    );

    const roomId = roomResult.insertId;

    await conn.query("INSERT INTO players (name, room_id) VALUES (?,?)", [
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
