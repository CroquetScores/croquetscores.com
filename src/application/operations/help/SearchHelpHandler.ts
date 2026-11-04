import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type {
  HelpSearchIndex,
  HelpSearchResult,
} from "../../services/HelpSearchIndex.js";
import { SearchHelp } from "./SearchHelp.js";

/** The pages of the help that answer a question (helpSearch.feature). */
export class SearchHelpHandler extends QueryHandler<
  SearchHelp,
  readonly HelpSearchResult[]
> {
  readonly handles: RequestType<SearchHelp> = SearchHelp;

  constructor(private readonly index: HelpSearchIndex) {
    super();
  }

  handle(query: SearchHelp): Promise<readonly HelpSearchResult[]> {
    return this.index.search(query.tag, query.rules, query.query);
  }
}
