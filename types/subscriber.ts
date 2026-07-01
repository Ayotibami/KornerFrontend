// Shape returned by the master-only GET /user/subscribers — the kornereffect
// mailing list.
export type Subscriber = {
  id: string;
  email: string;
  name: string;
  joined_at: string;
};
