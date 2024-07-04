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

export interface CustomInputNumberProps {
  min: number;
  max: number;
  step: number;
  name: string;
  value: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface RoomAllocationProps {
  guest: People;
  rooms: Room[];
  onChange?: (roomAllocation: defaultRooms[]) => void;
}
