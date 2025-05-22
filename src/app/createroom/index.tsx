import Image from "next/image";
import { Input } from "@/components/ui/input";

export default function Createroom() {
  return (
    <div className="min-h-[calc(100vh-48px)] flex flex-col items-center justify-center">
      <div className="">
        <label htmlFor="name">名前</label>
        <Input />
      </div>
    </div>
  );
}
