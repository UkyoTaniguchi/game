import Link from "next/link";
import Title from "./components/Title";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-48px)] flex flex-col items-center justify-center">
      <Title />
      <div className="flex pt-5 gap-4">
        <Button asChild>
          <Link href="/createroom">ルームの作成</Link>
        </Button>
        <Button asChild>
          <Link href="/joinroom">ルームに参加</Link>
        </Button>
      </div>
    </div>
  );
}
