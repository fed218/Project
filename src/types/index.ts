export interface People {
  adult: number;
  child: number;
}

export interface Room {
  roomPrice: number;
  adultPrice: number;
  childPrice: number;
  capacity: number;
}

export interface PeopleGroups {
  familyGroup: number;
  adultGroup: number;
  singleAdult: number;
}

export interface RoomsPriceOrder {
  price: number;
  roomIndex: number;
}

export interface defaultRooms {
  adult: number;
  child: number;
  price: number;
}
