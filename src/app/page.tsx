"use client";
import { useState, useEffect } from "react";
import { RoomAllocation } from "@/components";
import { People, Room } from "@/types";

export default function Home() {
  const [guest, setGuest] = useState<People | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    setGuest({ adult: 8, child: 3 });
    setRooms([
      { roomPrice: 1000, adultPrice: 200, childPrice: 100, capacity: 4 },
      { roomPrice: 2000, adultPrice: 200, childPrice: 100, capacity: 4 },
      { roomPrice: 1000, adultPrice: 400, childPrice: 200, capacity: 2 },
      { roomPrice: 2000, adultPrice: 400, childPrice: 200, capacity: 2 },
    ]);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {guest && rooms.length && (
        <RoomAllocation
          guest={guest}
          rooms={rooms}
          onChange={(roomAllocation) => {
            console.log(roomAllocation);
          }}
        />
      )}
    </main>
  );
}
