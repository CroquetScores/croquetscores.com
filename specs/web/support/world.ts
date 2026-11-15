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

  /**
   * What the scenario's browser says on every request: the languages its
   * reader reads, and the website a proxy says it was asked for.
   */
  public extraHeaders: Record<string, string> = {};

  /** The tournaments the scenario made, by the name it gave them. */
  public tournaments = new Map<
    string,
    { id: string; manager: string; request: Record<string, unknown> }
  >();

  /** What the scenario has said of the next tournament it creates. */
  public ofTheNext: Record<string, unknown> = {};

  /** A page on some other site, served into the browser by the scenario. */
  public elsewhere: string | undefined;

  /** What a page read without a browser said, and how it was answered. */
  public looked: { body: string; status: number } | undefined;

  /** The page of the scenario's browser, which a scenario that has none lacks. */
  get browserPage(): Page {
    if (this.page === undefined) {
      throw new Error("This scenario has no browser. Tag it @browser.");
    }
    return this.page;
  }
}

setWorldConstructor(WebWorld);
