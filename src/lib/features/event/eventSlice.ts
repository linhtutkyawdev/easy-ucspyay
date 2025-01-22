import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface EventState {
  events: { event_name: string; event_day: Date }[] | null;
  contestants:
    | {
        contestant_no: number;
        id: string;
        full_name: string;
        image_url: string;
        gender: string;
        nick_name: string;
        height: number;
      }[]
    | null;
  contestant_groups: string[];
}

// Define the initial state using that type
const initialState: EventState = {
  events: null,
  contestants: null,
  contestant_groups: ["male", "female", "couple"],
};

export const eventSlice = createSlice({
  name: "event",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setEvents: (
      state,
      action: PayloadAction<{ event_name: string; event_day: Date }[] | null>
    ) => {
      state.events = action.payload;
    },
    moveEventToStart: (state, action: PayloadAction<number>) => {
      if (!state.events) return;
      const e = [...state.events];
      e.unshift(...e.splice(action.payload, 1));
      state.events = e;
    },
    setContestants: (
      state,
      action: PayloadAction<
        | {
            contestant_no: number;
            id: string;
            full_name: string;
            image_url: string;
            gender: string;
            nick_name: string;
            height: number;
          }[]
        | null
      >
    ) => {
      state.contestants = action.payload;
    },
    setContestantGroups: (state, action: PayloadAction<string[]>) => {
      state.contestant_groups = action.payload;
    },
    moveContestantGroupToStart: (state, action: PayloadAction<number>) => {
      if (!state.contestant_groups) return;
      const c = [...state.contestant_groups];
      c.unshift(...c.splice(action.payload, 1));
      state.contestant_groups = c;
    },
  },
});

export const {
  setEvents,
  moveEventToStart,
  setContestants,
  setContestantGroups,
  moveContestantGroupToStart,
} = eventSlice.actions;

export default eventSlice.reducer;
