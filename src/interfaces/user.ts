export interface IUser {
  id: string;
  name: string;
  avatar: string;
}

export interface IGroup {
  groupId: string;
  name: string;
  icon: string;
  description: string;
  memberCount: number;
}
