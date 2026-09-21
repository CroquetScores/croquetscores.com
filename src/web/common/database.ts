// What a page needs of the database, said as a function rather than as a
// thing: a route hands its work to this, and whatever ran it gives it a
// connection and keeps or gives up what it wrote.
//
// It is a type and nothing else. What is behind it is chosen in server.ts, the
// one file outside src/infrastructure/ that may name a database at all, so a
// page can read and write without knowing there is one.
export type InTransaction = <TResult>(
  work: () => Promise<TResult>,
) => Promise<TResult>;
