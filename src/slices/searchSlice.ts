'use client'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import { searchClient } from "@/lib/firebase";
import {RootState} from "@/data/types";

const indexName = 'stays';
const index = searchClient.initIndex(indexName);

export const searchAsync = createAsyncThunk(
    'search/search',
    async (value: string, { rejectWithValue }) => {
        try {
            const data = await index.search(value);
            const processed = data.hits.flatMap((hit: any) => {
                const fullLocation = `${hit.location.street}, ${hit.location.city}, ${hit.location.country}`;
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

interface SearchState {
    isLoading: boolean;
    hasError: boolean;
    errorMessage: string;
    currentTerm: string;
    currentResults: any[];
    preFilteredList: any[];
    processedList: any[];
    displayList: any[];
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
                state.preFilteredList = state.currentResults;
                state.currentResults = action.payload.data;
                state.currentTerm = action.payload.term;
                state.processedList = action.payload.processed;
            })
            .addCase(searchAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.payload as string || 'Search failed';
            });
    }
});

export const {updatePreFilter} = searchSlice.actions;
export const selectDisplayList = (state: RootState) => state.search.displayList;
export const selectSearchResults = (state: RootState) => state.search.currentResults;
export const selectIsLoading = (state: RootState) => state.search.isLoading;
export const selectProcessedList = (state: RootState) => state.search.processedList;
export const selectPreFilteredList = (state: RootState) => state.search.preFilteredList;

export default searchSlice.reducer;
