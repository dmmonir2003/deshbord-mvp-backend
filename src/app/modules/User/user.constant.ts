export const USER_ROLE = {
  superAdmin: 'superAdmin',
  client: 'client',
  admin: 'admin',
  subscriber: 'subscriber',
} as const;


export const usersSearchableFields = [
  'email',
  'address',
  'name.firstName',
  'name.lastName',
  'name'
];


export const UserStatus = ['active', 'blocked'];
