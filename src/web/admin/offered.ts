// What a new or changed tournament can be on the website being read: its
// sports and formats, and the countries with their regions. Each is asked of
// the API that apps use (`/api/v0`) and not of an address of the admin's own,
// so that the website's forms and an app's choose from the same lists.

export interface Offered {
  readonly sports: readonly { readonly code: string; readonly name: string }[];
  readonly formats: readonly {
    readonly code: string;
    readonly name: string;
    /** Whether it is played by teams, and so has tests to draw. */
    readonly teams: boolean;
    /** Whether a tournament in it draws a level test unless said not to. */
    readonly drawsLevelTests: boolean;
  }[];
  readonly countries: readonly {
    readonly code: string;
    readonly name: string;
    readonly regions: readonly {
      readonly code: string;
      readonly name: string;
    }[];
  }[];
}

// The language is sent with each question because two of the three answer in
// English unless asked otherwise, where the page is in the reader's language
// and so must every choice on it be. The page's own language is written from
// the site's list of them, so none of the three refuses it.
const askedOf = async <T>(address: string, language: string): Promise<T> => {
  const response = await fetch(
    `${address}?language=${encodeURIComponent(language)}`,
    { headers: { accept: "application/json" } },
  );
  if (!response.ok) throw new Error(`${address} answered ${response.status}.`);
  return (await response.json()) as T;
};

const languageOfThePage = (): string => document.documentElement.lang || "en";

// Nothing where any it asks for could not be had, since a form with a list
// missing would offer less than creating a tournament accepts, and so would
// refuse what it offered. Callers show nothing rather than a part.
export const askedWhatIsOffered = async (): Promise<Offered | undefined> => {
  const language = languageOfThePage();
  try {
    const [sports, formats, countries] = await Promise.all([
      askedOf<Pick<Offered, "sports">>("/api/v0/tournaments/sports", language),
      askedOf<Pick<Offered, "formats">>(
        "/api/v0/tournaments/formats",
        language,
      ),
      askedOf<Pick<Offered, "countries">>("/api/v0/countries", language),
    ]);
    return {
      sports: sports.sports,
      formats: formats.formats,
      countries: countries.countries,
    };
  } catch {
    return undefined;
  }
};

// The names the list of tournaments filters by, which has no use for formats
// and so does not depend on them being had.
export const askedWhatIsNamed = async (): Promise<
  Pick<Offered, "sports" | "countries"> | undefined
> => {
  const language = languageOfThePage();
  try {
    const [sports, countries] = await Promise.all([
      askedOf<Pick<Offered, "sports">>("/api/v0/tournaments/sports", language),
      askedOf<Pick<Offered, "countries">>("/api/v0/countries", language),
    ]);
    return { sports: sports.sports, countries: countries.countries };
  } catch {
    return undefined;
  }
};
