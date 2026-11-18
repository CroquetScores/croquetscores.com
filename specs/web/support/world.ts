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

  /**
   * The session a scenario that asks the API without a browser holds, as the
   * cookie a browser would send, where somebody is signed in.
   */
  public apiSession: string | undefined;

  /** The colour scheme the scenario's machine says it prefers, where it does. */
  public colourScheme: "light" | "dark" | undefined;

  /**
   * What the scenario's browser says on every request: the languages its
   * reader reads, and the website a proxy says it was asked for.
   */
  public extraHeaders: Record<string, string> = {};
  public focusNeverLeft: boolean | undefined;

  /** The tournaments the scenario made, by the name it gave them. */
  public tournaments = new Map<
    string,
    {
      id: string;
      manager: string;
      request: Record<string, unknown>;
      address: string;
    }
  >();

  /** What the scenario has said the next manager note says, until it says another. */
  public noteSays = "";

  /** The ids of the manager notes the scenario added, by their titles. */
  public notes = new Map<string, string>();

  /** The account a scenario holds by its id, which its address may no longer find. */
  public accountHeld: string | undefined;

  /** Where in the site's log this scenario begins. */
  public logFrom = 0;

  /** The link a scenario is about to follow, and whose mail it came from. */
  public linkInHand: string | undefined;
  public addressInHand: string | undefined;

  /** Other browsers the scenario opened, standing in for other devices. */
  public otherBrowsers: BrowserContext[] = [];

  /** What the accounts the scenario made are called, by address. */
  public accountNames = new Map<string, string>();

  /** The ids of the commentaries and comments the scenario added. */
  public commentaries = new Map<string, string>();
  public comments = new Map<string, string>();

  /** What the scenario has said of the next player it adds. */
  public ofTheNextPlayer: Record<string, unknown> = {};

  /** What the scenario has said of the next team and the next test it adds. */
  public ofTheNextTeam: Record<string, unknown> = {};
  public ofTheNextTest: Record<string, unknown> = {};

  /** The teams and tests the scenario added, by the names it gave them. */
  public teamPlayers = new Map<string, string>();
  public teams = new Map<string, { id: string; shortName: string }>();
  public tests = new Map<
    string,
    { id: string; request: Record<string, unknown> }
  >();

  /** Whether the scenario's browser is one that never loads Google's script. */
  public recaptchaBlocked = false;

  /** The name of the tournament the scenario made last. */
  public lastTournament: string | undefined;

  /** What the scenario has said of the next knockout it adds. */
  public ofTheNextKnockout: Record<string, unknown> = {};

  /** What the scenario has said of the next block it adds. */
  public ofTheNextBlock: Record<string, unknown> = {};

  /** The ids the site gave what the scenario added, by the names it gave them. */
  public competitions = new Map<string, string>();
  public players = new Map<string, string>();
  public entered = new Map<string, string>();
  public games = new Map<string, string>();

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
