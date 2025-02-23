import { configureStore } from '@reduxjs/toolkit';
import { tasksReducer } from './tasksSlice.js';
import { searchFilterReducer } from './searchSlice.js';
import { filterReduser } from './filterSlice.js';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    searchFilter: searchFilterReducer,
    filter: filterReduser,
  },
});