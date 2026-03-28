export type UpsertAuthUserInput = {
  externalAuthId: string;
  email: string | null;
  phone: string | null;
  name: string | null;
};
