import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface UserState {
  users:
    | {
        id: string;
        full_name: string;
        image_url: string;
        ucspyay_mail: string;
        is_admin: boolean;
      }[]
    | null;

  user: {
    id: string;
    full_name: string;
    image_url: string;
    ucspyay_mail: string;
    is_admin: boolean;
  } | null;

  votesLeft: string[] | null;
}

// Define the initial state using that type
const initialState: UserState = {
  users: null,
  user: null,
  votesLeft: null,
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setUsers: (
      state,
      action: PayloadAction<
        | {
            id: string;
            full_name: string;
            image_url: string;
            ucspyay_mail: string;
            is_admin: boolean;
          }[]
        | null
      >
    ) => {
      state.users = action.payload;
    },
    setUser: (
      state,
      action: PayloadAction<{
        id: string;
        full_name: string;
        image_url: string;
        ucspyay_mail: string;
        is_admin: boolean;
      } | null>
    ) => {
      state.user = action.payload;
    },
    setVotesLeft: (state, action: PayloadAction<string[] | null>) => {
      state.votesLeft = action.payload;
    },
  },
});

export const { setUsers, setUser, setVotesLeft } = userSlice.actions;

export default userSlice.reducer;
