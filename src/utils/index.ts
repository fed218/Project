import {
  People,
  Room,
  PeopleGroups,
  RoomsPriceOrder,
  defaultRooms,
} from "@/types";
import { PeopleGroupsType } from "@/types/enum";

const getPeopleGroupsPrice = (room: Room, type: PeopleGroupsType): number => {
  const { roomPrice, adultPrice, childPrice } = room;

  switch (type) {
    case PeopleGroupsType.FamilyGroup:
      return roomPrice + adultPrice + childPrice;
    case PeopleGroupsType.AdultGroup:
      return roomPrice + adultPrice * 2;
    case PeopleGroupsType.SingleAdult:
      return roomPrice + adultPrice;
    default:
      return roomPrice;
  }
};

const getRoomsPriceOrder = (
  rooms: Room[],
  type: PeopleGroupsType
): RoomsPriceOrder[] => {
  let result: RoomsPriceOrder[] = [];

  result = rooms
    .map((room, roomIndex) => ({
      price: getPeopleGroupsPrice(room, type),
      roomIndex,
    }))
    .sort((a, b) => a.price - b.price);

  return result;
};

const getPeopleGroups = ({ adult, child }: People): PeopleGroups => {
  const familyGroup = child;
  let adultGroup = 0;
  let singleAdult = 0;

  if (child) {
    const remainingAdult = adult - child;
    adultGroup = Math.floor(remainingAdult / 2);
    singleAdult = remainingAdult % 2;
  } else {
    singleAdult = adult;
  }

  return {
    familyGroup,
    adultGroup,
    singleAdult,
  };
};

const getGroupNowOrder = (
  rooms: Room[],
  roomsPriceOrder: RoomsPriceOrder[],
  calcCapacity = 1
): number => {
  return roomsPriceOrder.findIndex(({ roomIndex }) => {
    return rooms[roomIndex].capacity >= calcCapacity;
  });
};

const getInitDistributeRooms = (count: number): defaultRooms[] => {
  return Array.from({ length: count }).map(() => ({
    adult: 0,
    child: 0,
    price: 0,
  }));
};

export const getDefaultRoomAllocation = (
  people: People,
  rooms: Room[]
): defaultRooms[] => {
  let globalResult = getInitDistributeRooms(rooms.length);

  // TODO 待抽離優化
  const getDistributeRooms = (
    people: People,
    rooms: Room[],
    distributeRooms: defaultRooms[]
  ) => {
    const distributeRoomsResult: defaultRooms[] = JSON.parse(
      JSON.stringify(distributeRooms)
    );
    const roomsCalcStorage: Room[] = JSON.parse(JSON.stringify(rooms));
    const { familyGroup, adultGroup, singleAdult } = getPeopleGroups(people);
    const familyGroupRoomsPriceOrder = getRoomsPriceOrder(
      rooms,
      PeopleGroupsType.FamilyGroup
    );
    const adultGroupRoomsPriceOrder = getRoomsPriceOrder(
      rooms,
      PeopleGroupsType.AdultGroup
    );
    const singleAdultRoomsPriceOrder = getRoomsPriceOrder(
      rooms,
      PeopleGroupsType.SingleAdult
    );

    const familyGroupNowOrder = getGroupNowOrder(
      roomsCalcStorage,
      familyGroupRoomsPriceOrder,
      2
    );
    const adultGroupNowOrder = getGroupNowOrder(
      roomsCalcStorage,
      adultGroupRoomsPriceOrder,
      2
    );
    const singleAdultNowOrder = getGroupNowOrder(
      roomsCalcStorage,
      singleAdultRoomsPriceOrder
    );

    if (familyGroup && adultGroup) {
      const isFamilyPriority =
        familyGroupRoomsPriceOrder[familyGroupNowOrder].price +
          adultGroupRoomsPriceOrder[familyGroupNowOrder + 1].price >
        adultGroupRoomsPriceOrder[familyGroupNowOrder].price +
          adultGroupRoomsPriceOrder[familyGroupNowOrder + 1].price;

      if (isFamilyPriority) {
        const roomsIndex =
          familyGroupRoomsPriceOrder[familyGroupNowOrder].roomIndex;
        roomsCalcStorage[roomsIndex].capacity -= 2;
        const { adult, child, price } = distributeRoomsResult[roomsIndex];
        distributeRoomsResult[roomsIndex] = {
          price: price + familyGroupRoomsPriceOrder[familyGroupNowOrder].price,
          adult: adult + 1,
          child: child + 1,
        };
        people.adult -= 1;
        people.child -= 1;
      } else {
        const roomsIndex =
          adultGroupRoomsPriceOrder[adultGroupNowOrder].roomIndex;
        roomsCalcStorage[roomsIndex].capacity -= 2;
        const { adult, child, price } = distributeRoomsResult[roomsIndex];
        distributeRoomsResult[roomsIndex] = {
          price: price + adultGroupRoomsPriceOrder[adultGroupNowOrder].price,
          adult: adult + 2,
          child,
        };
        people.adult -= 2;
      }

      getDistributeRooms(people, roomsCalcStorage, distributeRoomsResult);

      return;
    }

    if (familyGroup) {
      const roomsIndex =
        familyGroupRoomsPriceOrder[familyGroupNowOrder].roomIndex;
      roomsCalcStorage[roomsIndex].capacity -= 2;
      const { adult, child, price } = distributeRoomsResult[roomsIndex];
      distributeRoomsResult[roomsIndex] = {
        price: price + familyGroupRoomsPriceOrder[familyGroupNowOrder].price,
        adult: adult + 1,
        child: child + 1,
      };
      people.adult -= 1;
      people.child -= 1;

      getDistributeRooms(people, roomsCalcStorage, distributeRoomsResult);

      return;
    }

    if (adultGroup) {
      const roomsIndex =
        adultGroupRoomsPriceOrder[adultGroupNowOrder].roomIndex;
      roomsCalcStorage[roomsIndex].capacity -= 2;
      const { adult, child, price } = distributeRoomsResult[roomsIndex];
      distributeRoomsResult[roomsIndex] = {
        price: price + adultGroupRoomsPriceOrder[adultGroupNowOrder].price,
        adult: adult + 2,
        child,
      };
      people.adult -= 2;

      getDistributeRooms(people, roomsCalcStorage, distributeRoomsResult);
      return;
    }

    if (singleAdult) {
      const roomsIndex =
        singleAdultRoomsPriceOrder[singleAdultNowOrder].roomIndex;
      roomsCalcStorage[roomsIndex].capacity -= 1;
      const { adult, child, price } = distributeRoomsResult[roomsIndex];
      distributeRoomsResult[roomsIndex] = {
        price: price + singleAdultRoomsPriceOrder[singleAdultNowOrder].price,
        adult: adult + 1,
        child,
      };
      people.adult -= 1;

      getDistributeRooms(people, roomsCalcStorage, distributeRoomsResult);
      return;
    }

    globalResult = distributeRoomsResult;
  };

  getDistributeRooms(people, rooms, globalResult);

  return globalResult;
};
