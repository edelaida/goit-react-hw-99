import { createSelector, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { addTodoThunk, deleteTodoThunk, fetchTodos, toggleTodoThunk } from './tasksOps.js';
import { selectFilter } from './filterSlice.js';

const initialState = {
  items: [],
  searchStr: '',
  isLoading: false,
  isError: false,
};

const slice = createSlice({
  name: 'tasks',
  initialState,

  extraReducers: builder => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(deleteTodoThunk.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(addTodoThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(toggleTodoThunk.fulfilled, (state, action) => {
        const itemIndex = state.items.findIndex(item => item.id === action.payload.id);

        state.items[itemIndex].completed = !state.items[itemIndex].completed;
      })

      .addMatcher(isAnyOf(fetchTodos.pending, deleteTodoThunk.pending, addTodoThunk.pending, toggleTodoThunk.pending), (state, action) => {
        state.isLoading = true;
      })
      .addMatcher(isAnyOf(fetchTodos.fulfilled, deleteTodoThunk.fulfilled, addTodoThunk.fulfilled, toggleTodoThunk.fulfilled), (state, action) => {
        state.isLoading = false;
      })
      .addMatcher(isAnyOf(fetchTodos.rejected, deleteTodoThunk.rejected, addTodoThunk.rejected, toggleTodoThunk.rejected), (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });
  },
});

export const tasksReducer = slice.reducer;

export const selectTasks = state => state.tasks.items;
export const selectIsLoading = state => state.tasks.isLoading;
export const selectIsError = state => state.tasks.isError;

export const selectFilteredDataMemo = createSelector([selectTasks, selectFilter], (tasks, filter) => {
  switch (filter) {
    case 'active':
      return tasks.filter(todo => !todo.completed);
    case 'completed':
      return tasks.filter(todo => todo.completed);
    default:
      return tasks;
  }
});
   

export const selectUncompletedTodosMemo = createSelector([selectTasks], tasks => {
  return tasks.reduce((total, curr) => (curr.completed ? total : total + 1), 0);
}); 
   
