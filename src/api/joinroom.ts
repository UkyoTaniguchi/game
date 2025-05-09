// pages/api/join-room.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { roomId, password, playerName } = req.body;

  const [rows]: any = await db.query("SELECT * FROM rooms WHERE id = ?", [
    roomId,
  ]);
  if (rows.length === 0)
    return res.status(404).json({ error: "ルームが見つかりません" });

  const room = rows[0];
  const isMatch = await bcrypt.compare(password, room.password_hash);

  if (!isMatch) return res.status(401).json({ error: "パスワードが違います" });

  await db.query("INSERT INTO players (name, room_id) VALUES (?, ?)", [
    playerName,
    roomId,
  ]);

  res.status(200).json({ success: true });
}
