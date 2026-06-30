import { store } from "./store";
import { booksApi } from "../api/books";

export function resetApiCache() {
  store.dispatch(booksApi.util.resetApiState());
}
