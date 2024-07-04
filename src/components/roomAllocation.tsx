"use client";
import { useEffect, useState } from "react";
import { CustomInputNumber } from "@/components";
import { RoomAllocationProps, defaultRooms } from "@/types";
import { getDefaultRoomAllocation } from "@/utils";

// TODO 功能未完成，待補齊
export const RoomAllocation = (props: RoomAllocationProps) => {
  const { guest, rooms, onChange } = props;
  const [defaultRooms, setDefaultRooms] = useState<defaultRooms[]>([]);

  useEffect(() => {
    const defaultRooms = getDefaultRoomAllocation(guest, rooms);
    console.log("defaultRooms", defaultRooms);
  }, []);

  const [testValue, setTestValue] = useState("0");

  return (
    <>
      {rooms.map((room, roomIndex) => {
        return (
          <CustomInputNumber
            key={roomIndex}
            min={0}
            max={room.capacity}
            step={1}
            name={`room-${roomIndex}`}
            value={testValue}
            onChange={(e) => {
              const value = Number(e.target.value) > 5 ? "5" : e.target.value;
              setTestValue(value);
            }}
            onBlur={(e) => {}}
          />
        );
      })}
    </>
  );
};
