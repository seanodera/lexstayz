"use client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { searchClient, firestore } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getCountFromServer,
  getDocs,
  or,
  and,
} from "firebase/firestore";
import { RootState } from "@/data/types";
import { LocationFilter } from "@/components/search/locationFilter";
import { eachDayOfInterval, formatISO, parseISO } from "date-fns";

const indexName = "stays";
const index = searchClient.initIndex(indexName);


export const fetchLocationSuggestions = createAsyncThunk(
  'search/fetchLocationSuggestions',
  async (query: string, { rejectWithValue }) => {
    try {
      const { hits } = await index.search(query, {
        attributesToRetrieve: ['location'],
        hitsPerPage: 10,
      });
      const locationProps: { [key: string]: any[] } = {};
      hits.forEach((hit: any) => {
        const location = hit.location;
        for (let subKey in location) {
          if (location[subKey] !== "") {
            locationProps[subKey] = locationProps[subKey] || [];
            if (!locationProps[subKey].includes(location[subKey])) {
              locationProps[subKey].push(location[subKey]);
            }
          }
        }
      });

      const suggestionsSet = new Set<string>();
      const suggestions = hits.flatMap((hit: any) => {
        const location = hit.location;
        const cityCountry = `${location.city}, ${location.country}`;
        const districtCityCountry = `${location.district}, ${location.city}, ${location.country}`;
        const cityCountryValue = JSON.stringify({
          city: location.city,
          country: location.country,
          district: undefined,
          street2: undefined,
          street: undefined,
        });
        const districtCityCountryValue = JSON.stringify({
          city: location.city,
          country: location.country,
          district: location.district,
          street2: undefined,
          street: undefined,
        });

        const results = [];
        if (!suggestionsSet.has(cityCountryValue)) {
          suggestionsSet.add(cityCountryValue);
          results.push({
            value: cityCountryValue,
            label: cityCountry,
          });
        }
        if (!suggestionsSet.has(districtCityCountryValue)) {
          suggestionsSet.add(districtCityCountryValue);
          results.push({
            value: districtCityCountryValue,
            label: districtCityCountry,
          });
        }
        return results;
      });

      return suggestions;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);
  
export const searchAsync = createAsyncThunk(
  "search/search",
  async (value: string, { rejectWithValue, getState }) => {
    try {
        const state = getState() as RootState;
        
      const data = await index.search(value);
      const processed = data.hits.flatMap((hit: any) => {
        const fullLocation = `${hit.location.district}, ${hit.location.city}, ${hit.location.country}`;
        const cityCountry = `${hit.location.city}, ${hit.location.country}`;
        return [
          {
            value: cityCountry,
            label: cityCountry,
          },
          {
            value: fullLocation,
            label: fullLocation,
          },
        ];
      });
      const mainData: any[] = data.hits;
      return { processed, data: mainData, term: value };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An error occurred while searching");
      }
    }
  }
);

export const fetchFilteredStaysCount = createAsyncThunk(
  "search/fetchFilteredStaysCount",
  async (
    filters: {
      typeFilter: string;
      priceRange?: number[];
      amenityFilters: string[];
      locationFilter?: LocationFilter;
      roomAndBedFilter?: {
        bedrooms: number;
        beds: number;
        bathrooms: number;
      }
    },
    { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
      const staysRef = collection(firestore, "stays");
      let staysQuery = query(staysRef, where("published", "==", true));

      // Filter by type
      if (filters.typeFilter !== "All") {
        staysQuery = query(staysQuery, where("type", "==", filters.typeFilter));
      }

      if (filters.priceRange) {
        staysQuery = query(
          staysQuery,
          or(
            and(
              where("price", ">=", filters.priceRange[0]),
              where("price", "<=", filters.priceRange[1])
            ),
            and(
              where("rooms.price", ">=", filters.priceRange[0]),
              where("rooms.price", "<=", filters.priceRange[1])
            )
          )
        );
      }
      // Filter by amenities
      if (filters.amenityFilters.length > 0) {
        filters.amenityFilters.forEach((amenity) => {
          staysQuery = query(
            staysQuery,
            where("amenities", "array-contains", amenity)
          );
        });
      }

      // Filter by location
      if (filters.locationFilter) {
        Object.keys(filters.locationFilter).forEach((key) => {
          if (filters.locationFilter![key as keyof LocationFilter]) {
            staysQuery = query(
              staysQuery,
              where(
                `location.${key}`,
                "==",
                filters.locationFilter![key as keyof LocationFilter]
              )
            );
          }
        });
      }

    if (filters.roomAndBedFilter) {
        const { bedrooms, beds, bathrooms } = filters.roomAndBedFilter as {
            bedrooms: number;
            beds: number;
            bathrooms: number;
        };

        staysQuery = query(
            staysQuery,
            or(
                and(
                    where("type", "==", "Home"),
                    where("bedrooms", ">=", bedrooms),
                    where("beds", ">=", beds),
                    where("bathrooms", ">=", bathrooms)
                ),
                and(
                    where("type", "==", "Hotel"),
                    where("rooms.beds", "array-contains", { number: beds })
                )
            )
        );
    }
     // Filter by date range for Home types
     const startDate = parseISO(state.confirmBooking.checkInDate);
     const endDate = parseISO(state.confirmBooking.checkInDate);
     const datesInRange = eachDayOfInterval({ start: startDate, end: endDate }).map(date => formatISO(date).split('T')[0]);

     // Split datesInRange into chunks of 10 to comply with Firestore's not-in limitation
     const dateChunks = [];
     for (let i = 0; i < datesInRange.length; i += 10) {
       dateChunks.push(datesInRange.slice(i, i + 10));
     }

     let finalQuery = staysQuery;
     dateChunks.forEach(chunk => {
       finalQuery = query(finalQuery, and(
         where("bookedDates", "not-in", chunk),
         where("fullyBookedDates", "not-in", chunk)
       ));
     });

      console.log(staysQuery)
      const countSnapshot = await getCountFromServer(finalQuery);
      return countSnapshot.data().count;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchFilteredStays = createAsyncThunk(
  "search/fetchFilteredStays",
  async (
    filters: {
      typeFilter: string;
      priceRange?: number[];
      amenityFilters: string[];
      locationFilter?: LocationFilter;
      roomAndBedFilter?: {
        bedrooms: number;
        beds: number;
        bathrooms: number;
      }
    },
    { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
        const staysRef = collection(firestore, "stays");
        let staysQuery = query(staysRef, where("published", "==", true));
  
        // Filter by type
        if (filters.typeFilter !== "All") {
          staysQuery = query(staysQuery, where("type", "==", filters.typeFilter));
        }
  
        if (filters.priceRange) {
          staysQuery = query(
            staysQuery,
            or(
              and(
                where("price", ">=", filters.priceRange[0]),
                where("price", "<=", filters.priceRange[1])
              ),
              and(
                where("rooms.price", ">=", filters.priceRange[0]),
                where("rooms.price", "<=", filters.priceRange[1])
              )
            )
          );
        }
        // Filter by amenities
        if (filters.amenityFilters.length > 0) {
          filters.amenityFilters.forEach((amenity) => {
            staysQuery = query(
              staysQuery,
              where("amenities", "array-contains", amenity)
            );
          });
        }
  
        // Filter by location
        if (filters.locationFilter) {
          Object.keys(filters.locationFilter).forEach((key) => {
            if (filters.locationFilter![key as keyof LocationFilter]) {
              staysQuery = query(
                staysQuery,
                where(
                  `location.${key}`,
                  "==",
                  filters.locationFilter![key as keyof LocationFilter]
                )
              );
            }
          });
        }
  
      if (filters.roomAndBedFilter) {
          const { bedrooms, beds, bathrooms } = filters.roomAndBedFilter as {
              bedrooms: number;
              beds: number;
              bathrooms: number;
          };
  
          staysQuery = query(
              staysQuery,
              or(
                  and(
                      where("type", "==", "Home"),
                      where("bedrooms", ">=", bedrooms),
                      where("beds", ">=", beds),
                      where("bathrooms", ">=", bathrooms)
                  ),
                  and(
                      where("type", "==", "Hotel"),
                      where("rooms.beds", "array-contains", { number: beds })
                  )
              )
          );
      }

         // Filter by date range for Home types
     const startDate = parseISO(state.confirmBooking.checkInDate);
     const endDate = parseISO(state.confirmBooking.checkInDate);
     const datesInRange = eachDayOfInterval({ start: startDate, end: endDate }).map(date => formatISO(date).split('T')[0]);

     // Split datesInRange into chunks of 10 to comply with Firestore's not-in limitation
     const dateChunks = [];
     for (let i = 0; i < datesInRange.length; i += 10) {
       dateChunks.push(datesInRange.slice(i, i + 10));
     }

     let finalQuery = staysQuery;
     dateChunks.forEach(chunk => {
       finalQuery = query(finalQuery, and(
         where("bookedDates", "not-in", chunk),
         where("fullyBookedDates", "not-in", chunk)
       ));
     });

      const snapshot = await getDocs(finalQuery);
      const data = snapshot.docs.map((doc) => doc.data());
      return data;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
interface SearchState {
  isLoading: boolean;
  isCountLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  currentTerm: string;
  currentResults: any[];
  preFilteredList: any[];
  processedList: any[];
  displayList: any[];
  availableCount: number;
  locationSuggestions: {label: string, value: any}[]
}

const initialState: SearchState = {
    isLoading: false,
    hasError: false,
    currentTerm: "",
    errorMessage: "",
    currentResults: [],
    preFilteredList: [],
    processedList: [],
    displayList: [],
    availableCount: 0,
    isCountLoading: false,
    locationSuggestions: []
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    updatePreFilter: (state, action: PayloadAction<any[]>) => {
      state.preFilteredList = action.payload;
    },
    setDisplayList: (state, action: PayloadAction<any[]>) => {
      state.displayList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preFilteredList = action.payload.data;
        state.currentResults = action.payload.data;
        state.currentTerm = action.payload.term;
        state.processedList = action.payload.processed;
      })
      .addCase(searchAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = (action.payload as string) || "Search failed";
      })
      .addCase(fetchFilteredStaysCount.pending, (state) => {
        state.isCountLoading = true;
      })
      .addCase(fetchFilteredStaysCount.fulfilled, (state, action) => {
        state.isCountLoading = false;
        state.availableCount = action.payload;
      })
      .addCase(fetchFilteredStaysCount.rejected, (state, action) => {
        state.isCountLoading = false;
        state.hasError = true;
        state.errorMessage =
          (action.payload as string) || "Failed to fetch filtered stays count";
      })
      .addCase(fetchFilteredStays.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFilteredStays.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preFilteredList = action.payload;
        state.currentResults = action.payload;
        state.displayList = action.payload;
      })
      .addCase(fetchFilteredStays.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage =
          (action.payload as string) || "Failed to fetch filtered stays";
      })
    .addCase(fetchLocationSuggestions.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchLocationSuggestions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.locationSuggestions = action.payload;
    })
    .addCase(fetchLocationSuggestions.rejected, (state, action) => {
      state.isLoading = false;
      state.hasError = true;
      state.errorMessage =
        (action.payload as string) || "Failed to fetch location suggestions";
    })
      ;
  },
});

export const { updatePreFilter, setDisplayList } = searchSlice.actions;
export const selectDisplayList = (state: RootState) => state.search.displayList;
export const selectSearchResults = (state: RootState) =>
  state.search.currentResults;
export const selectIsLoading = (state: RootState) => state.search.isLoading;
export const selectProcessedList = (state: RootState) =>
  state.search.processedList;
export const selectPreFilteredList = (state: RootState) =>
  state.search.preFilteredList;

export default searchSlice.reducer;
