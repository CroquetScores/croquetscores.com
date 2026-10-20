/**
 * `text` with neither the database's address nor its password said in it,
 * whatever the failure's own words were: a connection that is refused names
 * where it was trying to reach. Each part of the address is hidden on its own
 * as well as the whole, since a failure says the host without the rest, and the
 * longest first so that a part inside another does not leave the other broken
 * in two.
 *
 * Where there is no address there is nothing to hide, and where what is given
 * cannot be read as an address it is hidden whole and not in parts.
 */
export const withoutAddress = (
  text: string,
  address: string | undefined,
): string => {
  if (address === undefined || address === "") return text;
  const hidden = new Set<string>([address]);
  try {
    const url = new URL(address);
    for (const part of [url.password, url.host, url.hostname, url.username]) {
      if (part !== "") hidden.add(decodeURIComponent(part));
    }
  } catch {
    // Not an address, and so said as it is.
  }
  let said = text;
  for (const part of [...hidden].sort((a, b) => b.length - a.length)) {
    said = said.split(part).join("(a database)");
  }
  return said;
};
