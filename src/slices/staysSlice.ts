"use client";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/data/types";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import {
  query,
  where,
  limit as fbLimit,
  orderBy,
  startAfter,
  getCountFromServer,
} from "@firebase/firestore";
import { setBookingStay } from "@/slices/confirmBookingSlice";
import { Host } from "@/lib/types";

export interface Stay {
  id: string;
  rooms: any[];

  [key: string]: any;
}

interface StaysState {
  stays: Stay[];
  fetchedPages: Record<string, number[]>;
  page: number;
  limit: number;
  staysCount: number;
  homesCount: number;
  hotelsCount: number;
  currentStay: Stay;
  fetchedHosts: Host[];
  currentHost?: Host;
  currentId: number | string;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  hasRun: boolean;
  exchangeRates: any;
  globalCurrency: string;
  longitude: number | string;
  latitude: number | string;
}

const initialState: StaysState = {
  currentHost: undefined,
  fetchedHosts: [],
  stays: [],
  currentStay: {} as Stay,
  currentId: -1,
  isLoading: true,
  hasError: false,
  errorMessage: "",
  hasRun: false,
  exchangeRates: {},
  globalCurrency: "GHS",
  latitude: -1.29207,
  longitude: 36.82195,
  fetchedPages: { All: [], Homes: [], Hotels: [] },
  page: 0,
  limit: 8,
  staysCount: 0,
  homesCount: 0,
  hotelsCount: 0,
};

export const fetchStaysAsync = createAsyncThunk(
  "stays/fetchStays",
  async (
    { page, type }: { page: number; type: string },
    { getState, rejectWithValue }
  ) => {
    const state = (getState() as { stays: StaysState }).stays;
    const limit = state.limit;
    try {
      if (state.fetchedPages[type].includes(page)) {
        return { stays: [], page, type };
      }

      const staysRef = collection(firestore, "stays");
      const baseQuery = query(staysRef, where("published", "==", true), orderBy('publishedDate'));

      const filteredQuery =
        type === "All"
          ? query(baseQuery, where("type", "in", ["Home", "Hotel"]))
          : query(baseQuery, where("type", "==", type));

      const paginatedQuery =
        state.stays.length > 0
          ? query(
              filteredQuery,
              startAfter(state.stays[state.stays.length - 1].publishedDate)
            )
          : filteredQuery;

      const snapshot = await getDocs(query(paginatedQuery, fbLimit(limit)));
      console.log("Stays gotten: ", snapshot.docs.length);
      const stays = snapshot.docs.map((doc) => doc.data());

      return {
        stays,
        page,
        type,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const getStayCountsAsync = createAsyncThunk(
  "stays/getStayCounts",
  async (_, { rejectWithValue }) => {
    try {
      const staysRef = query(
        collection(firestore, "stays"),
        where("published", "==", true)
      );

      const staysCount = (await getCountFromServer(query(staysRef))).data()
        .count;
      const homesCount = (
        await getCountFromServer(query(staysRef, where("type", "==", "Home")))
      ).data().count;
      const hotelsCount = (
        await getCountFromServer(query(staysRef, where("type", "==", "Hotel")))
      ).data().count;
      return { staysCount, homesCount, hotelsCount };
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

export const setCurrentStayFromId = createAsyncThunk(
  "stays/setCurrentStayFromId",
  async (id: string, { getState, dispatch, rejectWithValue }) => {
    try {
      const { stays } = getState() as { stays: StaysState };

      const currentStay = stays.stays.find((value) => value.id === id);
      if (currentStay) {
        dispatch(setBookingStay(currentStay));
        return currentStay;
      } else {
        const staysRef = collection(firestore, "stays");
        const snapshot = await getDoc(doc(staysRef, id));
        const data = snapshot.data() as Stay;
        console.log("Gotten from firebase: ", data);
        dispatch(setAllStays([...stays.stays, data]));
        dispatch(setBookingStay(data));
        return data;
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

export const setCurrentHostById = createAsyncThunk(
  "stays/setCurrentHostById",
  async (id: string, { getState, dispatch, rejectWithValue }) => {
    const { stays } = getState() as { stays: StaysState };
    try {
      const host = stays.fetchedHosts.find((value) => value.uid === id);
      if (host) {
        return host;
      } else {
        const hostsRef = collection(firestore, "hosts");
        const hostSnapshot = await getDoc(doc(hostsRef, id));
        const host = hostSnapshot.data() as Host;
        dispatch(updateFetchedHosts(host));
        return host;
      }
    } catch (error) {
      console.log(error);
      rejectWithValue("Error Getting the stays Host");
    }
  }
);

const staysSlice = createSlice({
  name: "stays",
  initialState: initialState,
  reducers: {
    setAllStays: (state, action: PayloadAction<Stay[]>) => {
      state.stays = action.payload;
    },
    setCurrentStay: (state, action: PayloadAction<Stay>) => {
      state.currentStay = action.payload;
      state.currentId = -1;
    },
    resetStayError: (state) => {
      state.hasError = false;
      state.errorMessage = "";
    },
    setExchangeRates: (state, action) => {
      state.exchangeRates = action.payload?.rates || {};
      state.globalCurrency = action.payload?.currency || "USD";
    },
    updateFetchedHosts: (state, action) => {
      state.fetchedHosts = [...state.fetchedHosts, action.payload];
    },
    setUserLocation: (state, action) => {
      if (typeof action.payload.latitude === "string") {
        state.latitude =
          typeof action.payload.latitude === "string"
            ? parseFloat(action.payload.latitude)
            : action.payload.latitude;
        state.longitude =
          typeof action.payload.longitude === "string"
            ? parseFloat(action.payload.longitude)
            : action.payload.longitude;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaysAsync.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = "";
        console.log("loading....fetch stays");
      })
      .addCase(fetchStaysAsync.fulfilled, (state, action) => {
        const { page, stays, type } =
          action.payload;
          console.log(action.payload)
        if (!state.fetchedPages[type].includes(page)) {
          state.fetchedPages[type].push(page);
          state.isLoading = false;
          state.stays = [
            ...state.stays,
            ...(stays.filter(
              (newStay) => !state.stays.some((stay) => stay.id === newStay.id)
            ) as Stay[]),
          ];
        }
        state.hasRun = true;
      })
      .addCase(fetchStaysAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.hasRun = true;
        state.errorMessage =
          (action.payload as string) || "Failed to fetch stays";
      })
      .addCase(setCurrentStayFromId.pending, (state) => {
        state.isLoading = true;
        console.log("loading....set frm id");
      })
      .addCase(setCurrentStayFromId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStay = action.payload as Stay;
      })
      .addCase(setCurrentStayFromId.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage =
          (action.payload as string) || "Failed to set current stay";
      })
      .addCase(setCurrentHostById.pending, (state) => {
        state.isLoading = true;
        console.log("loading....set current Host ById");
      })
      .addCase(setCurrentHostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentHost = action.payload as Host;
      })
      .addCase(setCurrentHostById.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage =
          (action.payload as string) || "Failed to set current host";
      })
    .addCase(getStayCountsAsync.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = "";
        console.log("loading....get stay counts");
    })
    .addCase(getStayCountsAsync.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false;
        state.staysCount = action.payload.staysCount;
        state.homesCount = action.payload.homesCount;
        state.hotelsCount = action.payload.hotelsCount;
    })
    .addCase(getStayCountsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage =
            (action.payload as string) || "Failed to get stay counts";
    })
      ;
  },
});

export const selectCurrentStay = (state: RootState) => state.stays.currentStay;
export const selectAllStays = (state: RootState) => state.stays.stays;
export const selectIsStayLoading = (state: RootState) => state.stays.isLoading;
export const selectHasRun = (state: RootState) => state.stays.hasRun;
export const selectStayById = (state: RootState, id: string | number) =>
  state.stays.stays.find((stay: Stay) => stay.id === id);
export const selectExchangeRate = (state: RootState) =>
  state.stays.exchangeRates;
export const selectGlobalCurrency = (state: RootState) =>
  state.stays.globalCurrency;

export const {
  setAllStays,
  setCurrentStay,
  resetStayError,
  setExchangeRates,
  updateFetchedHosts,
  setUserLocation,
} = staysSlice.actions;

export default staysSlice.reducer;
