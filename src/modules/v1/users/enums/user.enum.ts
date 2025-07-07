export enum UserRole {
  Admin = 'admin'
}

export const UserLevels = {
  [UserRole.Admin]: 0,
};

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
