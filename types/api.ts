// Every server action in this codebase returns ApiResult<T>.
// Callers check `result.ok` to discriminate — TypeScript narrows the type automatically.
//
// Usage pattern:
//   const result = await someAction(...)
//   if (!result.ok) { toast.error(result.message); return; }
//   // TypeScript now knows result.data is type T

export type ApiSuccess<T = void> = {
  ok: true;
  data: T; // void for actions that just succeed/fail; use T when the action returns data
};

export type ApiError = {
  ok: false;
  status: number; // HTTP status — useful for distinguishing 401 (auth) from 500 (server error)
  message: string; // Human-readable error suitable for displaying in a toast
};

// Discriminated union — check `ok` first, TypeScript narrows to the correct branch.
export type ApiResult<T = void> = ApiSuccess<T> | ApiError;
