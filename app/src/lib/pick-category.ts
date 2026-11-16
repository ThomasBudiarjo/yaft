/**
 * Hands the category chosen in the /select-category sheet back to the screen that opened it.
 * Routes can't return values, and only one picker is open at a time, so one pending callback is enough.
 */
let pending: ((categoryId: string) => void) | null = null;

export function onCategoryPicked(callback: (categoryId: string) => void) {
  pending = callback;
}

export function categoryPicked(categoryId: string) {
  pending?.(categoryId);
  pending = null;
}
