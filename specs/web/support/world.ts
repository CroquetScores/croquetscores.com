// What a scenario in specs/web holds, which is a browser and where the site is.
// It names nothing of the site's code, since these specs know the site only by
// its address (AI.md §5): that is what makes a scenario here a statement about
// the website and not about how it is built.
import { World, setWorldConstructor } from "@cucumber/cucumber";
import type { BrowserContext, Page } from "playwright";

export class WebWorld extends World {
  /** Where the site is listening, such as http://127.0.0.1:50123. */
  public baseUrl: string | undefined;

  public browserContext: BrowserContext | undefined;
  public page: Page | undefined;

  /** The colour scheme the scenario's machine says it prefers, where it does. */
  public colourScheme: "light" | "dark" | undefined;

  /** What the scenario's browser says its reader reads, where it says. */
  public acceptLanguage: string | undefined;

  /** A page on some other site, served into the browser by the scenario. */
  public elsewhere: string | undefined;

  /** The page of the scenario's browser, which a scenario that has none lacks. */
  get browserPage(): Page {
    if (this.page === undefined) {
      throw new Error("This scenario has no browser. Tag it @browser.");
    }
    return this.page;
  }
}

setWorldConstructor(WebWorld);
