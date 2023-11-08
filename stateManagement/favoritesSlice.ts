const initialState: FavoritesState = {};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    resetFavoritesStateById(
      state,
      { payload }: PayloadAction<ResetFavoritesStateById>
    ) {
      const userIdToRemove = payload.userId;

      Object.keys(state).forEach((userId) => {
        if (state.userId === userIdToRemove) {
          delete state[userId];
        }
      });
    },
    toggleFavoritesState: <T extends Events | BusinessModel | Specials>(
      state: FavoritesState,
      { payload }: PayloadAction<AddFavorites<T>>
    ) => {
      const { userId, data, type } = payload;

      if (!state[userId]) {
        state[userId] = {};
      }

      if (!state[userId][type]) {
        state[userId][type] = [];
      }

      const items: (Events | BusinessModel | Specials)[] =
        state[userId][type] || [];
      const isExists = items.some((item) => item.id === data.id);

      if (isExists) {
        const indexToRemove = items.findIndex((item) => item.id === data.id);

        if (indexToRemove !== -1) {
          items?.splice(indexToRemove, 1);
        }
      } else {
        items.push(data);
      }

      return state;
    },
  },
});

export const favoritesActions = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
