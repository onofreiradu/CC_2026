export type CreateUserInput = {
  username: string;
  email: string;
  fullName: string;
  password: string;
  birthDate?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
};

export type CreateUserResult = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  birth_date: string | null;
  phone_number: string | null;
  profile_picture_url: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateUserRequestBody = {
  username?: string;
  email?: string;
  full_name?: string;
  password?: string;
  birth_date?: string;
  phone_number?: string;
  profile_picture_url?: string;
};
