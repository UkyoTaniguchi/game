"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import React from "react";
import { useState } from "react";
import { z } from "zod";

export default function Room() {
  const [playerName, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [maxPlayers, setMaxplayers] = useState<number>();

  const handlecreateroom = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameSchema = z //バリデーション
      .string()
      .min(1, "ユーザー名を入力してください")
      .max(15, "ユーザー名を15字以内で入力してください");
    const nameresult = nameSchema.safeParse(playerName);
    if (!nameresult.success) {
      alert(nameresult.error.errors[0].message);
      return;
    }
    const passwordSchema = z
      .string()
      .min(6, "パスワードを6文字以上で入力してください")
      .max(15, "パスワードを15文字以内で入力してください")
      .regex(/^[A-Za-z0-9]+$/, "英数字のみ使用可能です");
    const passwordresult = passwordSchema.safeParse(password);
    if (!passwordresult.success) {
      alert(passwordresult.error.errors[0].message);
      return;
    }

    const response = await fetch("/api/createroom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerName, password, maxPlayers }),
    });
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    console.log("ルームが作成されました.ID:", data.roomId);
  };
  return (
    <div className="min-h-[calc(100vh-48px)] w-full flex flex-col items-center justify-center">
      <form
        onSubmit={handlecreateroom}
        className="bg-neutral-900 px-5 py-5 border border-gray-300 rounded-2xl"
      >
        <div className="mb-5">
          <label htmlFor="name">名前</label>
          <Input
            value={playerName}
            onChange={(e) => setName(e.target.value)}
            className="w-72"
            placeholder="ゲーム太郎"
          />
        </div>
        <div className="mb-5">
          <label htmlFor="name">パスワード</label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-72"
            placeholder="123456"
          />
        </div>
        <div className="mb-5">
          <label htmlFor="name">人数</label>
          <Select onValueChange={(value) => setMaxplayers(Number(value))}>
            <SelectTrigger className="w-72">
              <SelectValue placeholder="人数を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full flex justify-center">
          <Button>作成</Button>
        </div>
      </form>
    </div>
  );
}
