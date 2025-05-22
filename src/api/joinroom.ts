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

  const { roomId, playerName, password } = req.body;
  if (!roomId || !playerName || !password) {
    return res.status(400).json({ error: "全ての値を入力してください" });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [rows]: any = await conn.query("SELECT * FROM rooms WHERE id = ?", [
      roomId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "ルームが見つかりませんでした" });
    }

    const compared = await bcrypt.compare(password, rows[0].password_hash);
    if (!compared) {
      return res.status(401).json({ error: "パスワードが違います" });
    }

    await conn.query("INSERT INTO players (name, room_id) VALUES(?,?)", [
      playerName,
      roomId,
    ]);

    await conn.commit();
    res.status(200).json({ success: true });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: "エラーが発生しました" });
  } finally {
    conn.release();
  }
}
