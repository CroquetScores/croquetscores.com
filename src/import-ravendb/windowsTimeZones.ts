// Every time zone Windows keeps, by the name Windows gives it, and the code
// here of the country it means, or nothing where it means none
// (ImportTournaments.feature). The old sites ran on Windows and kept each
// tournament's time zone by these names, and kept no country.
//
// A zone is kept by more than one country, so each means the country of the
// zone the Unicode Consortium's list of Windows' zones gives it for the world
// as a whole: CLDR's windowsZones.xml, as its zones were in 2021a (other
// version 7e11800). That zone is named beside each, as it is in the tz
// database. A zone of an hour from UTC alone, such as "UTC-11", which the sea
// keeps, means no country.
//
// A country the site does not have is kept as CLDR has it, and refused where it
// is asked for, as a zone that is not here is: "South Sudan Standard Time" is
// South Sudan's, which the site does not have.
//
// What the import takes a zone to mean where that is not the country here is
// timeZones.ts's, which reads this.
export const windowsTimeZones: Readonly<Record<string, string | undefined>> = {
  "Dateline Standard Time": undefined, // Etc/GMT+12
  "UTC-11": undefined, // Etc/GMT+11
  "Aleutian Standard Time": "us", // America/Adak
  "Hawaiian Standard Time": "us", // Pacific/Honolulu
  "Marquesas Standard Time": "pf", // Pacific/Marquesas
  "Alaskan Standard Time": "us", // America/Anchorage
  "UTC-09": undefined, // Etc/GMT+9
  "Pacific Standard Time (Mexico)": "mx", // America/Tijuana
  "UTC-08": undefined, // Etc/GMT+8
  "Pacific Standard Time": "us", // America/Los_Angeles
  "US Mountain Standard Time": "us", // America/Phoenix
  "Mountain Standard Time (Mexico)": "mx", // America/Mazatlan
  "Mountain Standard Time": "us", // America/Denver
  "Yukon Standard Time": "ca", // America/Whitehorse
  "Central America Standard Time": "gt", // America/Guatemala
  "Central Standard Time": "us", // America/Chicago
  "Easter Island Standard Time": "cl", // Pacific/Easter
  "Central Standard Time (Mexico)": "mx", // America/Mexico_City
  "Canada Central Standard Time": "ca", // America/Regina
  "SA Pacific Standard Time": "co", // America/Bogota
  "Eastern Standard Time (Mexico)": "mx", // America/Cancun
  "Eastern Standard Time": "us", // America/New_York
  "Haiti Standard Time": "ht", // America/Port-au-Prince
  "Cuba Standard Time": "cu", // America/Havana
  "US Eastern Standard Time": "us", // America/Indianapolis
  "Turks And Caicos Standard Time": "tc", // America/Grand_Turk
  "Paraguay Standard Time": "py", // America/Asuncion
  "Atlantic Standard Time": "ca", // America/Halifax
  "Venezuela Standard Time": "ve", // America/Caracas
  "Central Brazilian Standard Time": "br", // America/Cuiaba
  "SA Western Standard Time": "bo", // America/La_Paz
  "Pacific SA Standard Time": "cl", // America/Santiago
  "Newfoundland Standard Time": "ca", // America/St_Johns
  "Tocantins Standard Time": "br", // America/Araguaina
  "E. South America Standard Time": "br", // America/Sao_Paulo
  "SA Eastern Standard Time": "gf", // America/Cayenne
  "Argentina Standard Time": "ar", // America/Buenos_Aires
  "Greenland Standard Time": "gl", // America/Godthab
  "Montevideo Standard Time": "uy", // America/Montevideo
  "Magallanes Standard Time": "cl", // America/Punta_Arenas
  "Saint Pierre Standard Time": "pm", // America/Miquelon
  "Bahia Standard Time": "br", // America/Bahia
  "UTC-02": undefined, // Etc/GMT+2
  "Azores Standard Time": "pt", // Atlantic/Azores
  "Cape Verde Standard Time": "cv", // Atlantic/Cape_Verde
  UTC: undefined, // Etc/UTC
  "GMT Standard Time": "gb", // Europe/London
  "Greenwich Standard Time": "is", // Atlantic/Reykjavik
  "Sao Tome Standard Time": "st", // Africa/Sao_Tome
  "Morocco Standard Time": "ma", // Africa/Casablanca
  "W. Europe Standard Time": "de", // Europe/Berlin
  "Central Europe Standard Time": "hu", // Europe/Budapest
  "Romance Standard Time": "fr", // Europe/Paris
  "Central European Standard Time": "pl", // Europe/Warsaw
  "W. Central Africa Standard Time": "ng", // Africa/Lagos
  "Jordan Standard Time": "jo", // Asia/Amman
  "GTB Standard Time": "ro", // Europe/Bucharest
  "Middle East Standard Time": "lb", // Asia/Beirut
  "Egypt Standard Time": "eg", // Africa/Cairo
  "E. Europe Standard Time": "md", // Europe/Chisinau
  "Syria Standard Time": "sy", // Asia/Damascus
  "West Bank Standard Time": "ps", // Asia/Hebron
  "South Africa Standard Time": "za", // Africa/Johannesburg
  "FLE Standard Time": "ua", // Europe/Kiev
  "Israel Standard Time": "il", // Asia/Jerusalem
  "South Sudan Standard Time": "ss", // Africa/Juba
  "Kaliningrad Standard Time": "ru", // Europe/Kaliningrad
  "Sudan Standard Time": "sd", // Africa/Khartoum
  "Libya Standard Time": "ly", // Africa/Tripoli
  "Namibia Standard Time": "na", // Africa/Windhoek
  "Arabic Standard Time": "iq", // Asia/Baghdad
  "Turkey Standard Time": "tr", // Europe/Istanbul
  "Arab Standard Time": "sa", // Asia/Riyadh
  "Belarus Standard Time": "by", // Europe/Minsk
  "Russian Standard Time": "ru", // Europe/Moscow
  "E. Africa Standard Time": "ke", // Africa/Nairobi
  "Iran Standard Time": "ir", // Asia/Tehran
  "Arabian Standard Time": "ae", // Asia/Dubai
  "Astrakhan Standard Time": "ru", // Europe/Astrakhan
  "Azerbaijan Standard Time": "az", // Asia/Baku
  "Russia Time Zone 3": "ru", // Europe/Samara
  "Mauritius Standard Time": "mu", // Indian/Mauritius
  "Saratov Standard Time": "ru", // Europe/Saratov
  "Georgian Standard Time": "ge", // Asia/Tbilisi
  "Volgograd Standard Time": "ru", // Europe/Volgograd
  "Caucasus Standard Time": "am", // Asia/Yerevan
  "Afghanistan Standard Time": "af", // Asia/Kabul
  "West Asia Standard Time": "uz", // Asia/Tashkent
  "Ekaterinburg Standard Time": "ru", // Asia/Yekaterinburg
  "Pakistan Standard Time": "pk", // Asia/Karachi
  "Qyzylorda Standard Time": "kz", // Asia/Qyzylorda
  "India Standard Time": "in", // Asia/Calcutta
  "Sri Lanka Standard Time": "lk", // Asia/Colombo
  "Nepal Standard Time": "np", // Asia/Katmandu
  "Central Asia Standard Time": "kg", // Asia/Bishkek
  "Bangladesh Standard Time": "bd", // Asia/Dhaka
  "Omsk Standard Time": "ru", // Asia/Omsk
  "Myanmar Standard Time": "mm", // Asia/Rangoon
  "SE Asia Standard Time": "th", // Asia/Bangkok
  "Altai Standard Time": "ru", // Asia/Barnaul
  "W. Mongolia Standard Time": "mn", // Asia/Hovd
  "North Asia Standard Time": "ru", // Asia/Krasnoyarsk
  "N. Central Asia Standard Time": "ru", // Asia/Novosibirsk
  "Tomsk Standard Time": "ru", // Asia/Tomsk
  "China Standard Time": "cn", // Asia/Shanghai
  "North Asia East Standard Time": "ru", // Asia/Irkutsk
  "Singapore Standard Time": "sg", // Asia/Singapore
  "W. Australia Standard Time": "au", // Australia/Perth
  "Taipei Standard Time": "tw", // Asia/Taipei
  "Ulaanbaatar Standard Time": "mn", // Asia/Ulaanbaatar
  "Aus Central W. Standard Time": "au", // Australia/Eucla
  "Transbaikal Standard Time": "ru", // Asia/Chita
  "Tokyo Standard Time": "jp", // Asia/Tokyo
  "North Korea Standard Time": "kp", // Asia/Pyongyang
  "Korea Standard Time": "kr", // Asia/Seoul
  "Yakutsk Standard Time": "ru", // Asia/Yakutsk
  "Cen. Australia Standard Time": "au", // Australia/Adelaide
  "AUS Central Standard Time": "au", // Australia/Darwin
  "E. Australia Standard Time": "au", // Australia/Brisbane
  "AUS Eastern Standard Time": "au", // Australia/Sydney
  "West Pacific Standard Time": "pg", // Pacific/Port_Moresby
  "Tasmania Standard Time": "au", // Australia/Hobart
  "Vladivostok Standard Time": "ru", // Asia/Vladivostok
  "Lord Howe Standard Time": "au", // Australia/Lord_Howe
  "Bougainville Standard Time": "pg", // Pacific/Bougainville
  "Russia Time Zone 10": "ru", // Asia/Srednekolymsk
  "Magadan Standard Time": "ru", // Asia/Magadan
  "Norfolk Standard Time": "nf", // Pacific/Norfolk
  "Sakhalin Standard Time": "ru", // Asia/Sakhalin
  "Central Pacific Standard Time": "sb", // Pacific/Guadalcanal
  "Russia Time Zone 11": "ru", // Asia/Kamchatka
  "New Zealand Standard Time": "nz", // Pacific/Auckland
  "UTC+12": undefined, // Etc/GMT-12
  "Fiji Standard Time": "fj", // Pacific/Fiji
  "Chatham Islands Standard Time": "nz", // Pacific/Chatham
  "UTC+13": undefined, // Etc/GMT-13
  "Tonga Standard Time": "to", // Pacific/Tongatapu
  "Samoa Standard Time": "ws", // Pacific/Apia
  "Line Islands Standard Time": "ki", // Pacific/Kiritimati
};
