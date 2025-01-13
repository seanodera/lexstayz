'use client'
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { searchClient, firestore } from "@/lib/firebase";
import { collection, query, where, getCountFromServer, getDocs } from 'firebase/firestore';
import { RootState } from "@/data/types";
import { LocationFilter } from "@/components/search/locationFilter";

const indexName = 'stays';
const index = searchClient.initIndex(indexName);

export const searchAsync = createAsyncThunk(
    'search/search',
    async (value: string, { rejectWithValue }) => {
        try {
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
                return rejectWithValue('An error occurred while searching');
            }
        }
    }
);

export const fetchFilteredStaysCount = createAsyncThunk(
    'search/fetchFilteredStaysCount',
    async (filters: {
        typeFilter: string;
        priceRange: number[];
        amenityFilters: string[];
        locationFilter?: LocationFilter;
        roomCountFilter?: number | null;
        ratingFilter: number[];
    }, { rejectWithValue }) => {
        try {
            const staysRef = collection(firestore, 'stays');
            let staysQuery = query(staysRef, where('published', '==', true));

            // Filter by type
            if (filters.typeFilter !== 'All') {
                staysQuery = query(staysQuery, where('type', '==', filters.typeFilter));
            }

            // Filter by price
            staysQuery = query(staysQuery, where('price', '>=', filters.priceRange[0]), where('price', '<=', filters.priceRange[1]));

            // Filter by amenities
            if (filters.amenityFilters.length > 0) {
                filters.amenityFilters.forEach(amenity => {
                    staysQuery = query(staysQuery, where('amenities', 'array-contains', amenity));
                });
            }

            // Filter by location
            if (filters.locationFilter) {
                Object.keys(filters.locationFilter).forEach(key => {
                    if (filters.locationFilter![key as keyof LocationFilter]) {
                        staysQuery = query(staysQuery, where(`location.${key}`, '==', filters.locationFilter![key as keyof LocationFilter]));
                    }
                });
            }

            // Filter by room count
            if (filters.roomCountFilter) {
                staysQuery = query(staysQuery, where('rooms.length', '==', filters.roomCountFilter));
            }

            // Filter by rating
            staysQuery = query(staysQuery, where('rating', '>=', filters.ratingFilter[0]), where('rating', '<=', filters.ratingFilter[1]));

            const countSnapshot = await getCountFromServer(staysQuery);
            return countSnapshot.data().count;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const fetchFilteredStays = createAsyncThunk('search/fetchFilteredStays', async (filters: {
    typeFilter: string;
    priceRange: number[];
    amenityFilters: string[];
    locationFilter?: LocationFilter;
    roomCountFilter?: number | null;
    ratingFilter: number[];
}, { rejectWithValue }) => {
    try {
        const staysRef = collection(firestore, 'stays');
        let staysQuery = query(staysRef, where('published', '==', true));

        // Filter by type
        if (filters.typeFilter !== 'All') {
            staysQuery = query(staysQuery, where('type', '==', filters.typeFilter));
        }

        // Filter by price
        staysQuery = query(staysQuery, where('price', '>=', filters.priceRange[0]), where('price', '<=', filters.priceRange[1]));

        // Filter by amenities
        if (filters.amenityFilters.length > 0) {
            filters.amenityFilters.forEach(amenity => {
                staysQuery = query(staysQuery, where('amenities', 'array-contains', amenity));
            });
        }

        // Filter by location
        if (filters.locationFilter) {
            Object.keys(filters.locationFilter).forEach(key => {
                if (filters.locationFilter![key as keyof LocationFilter]) {
                    staysQuery = query(staysQuery, where(`location.${key}`, '==', filters.locationFilter![key as keyof LocationFilter]));
                }
            });
        }

        // Filter by room count
        if (filters.roomCountFilter) {
            staysQuery = query(staysQuery, where('rooms.length', '==', filters.roomCountFilter));
        }

        // Filter by rating
        staysQuery = query(staysQuery, where('rating', '>=', filters.ratingFilter[0]), where('rating', '<=', filters.ratingFilter[1]));

        const snapshot = await getDocs(staysQuery);
        const data = snapshot.docs.map(doc => doc.data())
        return data;
    } catch (error) {
    console.log(error)
    if (error instanceof Error) {
        return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
}
})
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
}

const initialState: SearchState = {
    isLoading: false,
    hasError: false,
    currentTerm: '',
    errorMessage: '',
    currentResults: [],
    preFilteredList: [],
    processedList: [],
    displayList: [],
    availableCount: 0,
    isCountLoading: false
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        updatePreFilter: (state, action: PayloadAction<any[]>) => {
            state.preFilteredList = action.payload;
        },
        setDisplayList: (state, action: PayloadAction<any[]>) => {
            state.displayList = action.payload;
        }
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
                state.errorMessage = action.payload as string || 'Search failed';
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
                state.errorMessage = action.payload as string || 'Failed to fetch filtered stays count';
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
                state.errorMessage = action.payload as string || 'Failed to fetch filtered stays';
            })
            ;
    }
});

export const { updatePreFilter, setDisplayList } = searchSlice.actions;
export const selectDisplayList = (state: RootState) => state.search.displayList;
export const selectSearchResults = (state: RootState) => state.search.currentResults;
export const selectIsLoading = (state: RootState) => state.search.isLoading;
export const selectProcessedList = (state: RootState) => state.search.processedList;
export const selectPreFilteredList = (state: RootState) => state.search.preFilteredList;

export default searchSlice.reducer;
