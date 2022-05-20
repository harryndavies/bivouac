export interface IGroup {
  id?: string;
  name: string;
  admin: string;
}

export interface IMembership {
  id?: string;
  group: string;
  groupName: string;
  user: string;
}

export interface ISite {
  GroupID: string;
  words: string;
}
