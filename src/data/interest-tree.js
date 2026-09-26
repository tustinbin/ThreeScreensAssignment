/** Default curiosity niches — hierarchical groups with keyword lists for matching. */

export const INTEREST_TREE = [
  {
    id: "film",
    label: "Film & TV",
    keywords: ["film", "movie", "cinema", "television", "hollywood"],
    children: [
      { id: "film-production", label: "Production trivia", keywords: ["filming", "on set", "movie studio", "cinematograph", "film production", "principal photography"], categoryHints: ["film production", "filming", "cinematograph"] },
      { id: "film-effects", label: "Effects & craft", keywords: ["special effects", "visual effects", "animatronic", "prosthetic", "stop motion", "practical effects"], categoryHints: ["special effects", "visual effects", "animatronic"] },
      { id: "film-studio", label: "Studio history", keywords: ["hollywood", "paramount", "warner bros", "universal studios", "pixar", "film studio"], categoryHints: ["film studios", "movie studios", "hollywood"] },
      { id: "film-tv", label: "Television", keywords: ["television", "tv series", "sitcom", "broadcast", "soap opera", "television series"], categoryHints: ["television", "television series", "sitcoms"] },
      { id: "film-actors", label: "Actors & directors", keywords: ["actor", "actress", "film director", "screenwriter", "filmmaker", "cinematographer"], categoryHints: ["actors", "actresses", "film directors", "screenwriters"] },
      { id: "film-animation", label: "Animation", keywords: ["animated film", "animated feature", "animated series", "stop motion", "stop-motion", "animation studio", "animator", "anime", "cartoon", "pixar", "dreamworks", "animated"], categoryHints: ["animated", "animation", "anime", "cartoon", "stop-motion", "stop motion", "animators"] },
    ],
  },
  {
    id: "parks",
    label: "Theme parks",
    keywords: ["theme park", "amusement park", "roller coaster"],
    children: [
      { id: "parks-disney", label: "Disney parks", keywords: ["disney", "disneyland", "disney world", "walt disney", "magic kingdom", "epcot", "imagineer"] },
      { id: "parks-incidents", label: "Park incidents", keywords: ["ride accident", "roller coaster accident", "park accident", "amusement park accident"] },
      { id: "parks-rides", label: "Ride engineering", keywords: ["roller coaster", "dark ride", "ferris wheel", "carousel", "ride system"] },
      { id: "parks-history", label: "Park history", keywords: ["amusement park", "theme park", "world's fair", "boardwalk", "carnival"] },
      { id: "parks-universal", label: "Other parks", keywords: ["universal studios", "six flags", "cedar point", "europa-park", "legoland"] },
    ],
  },
  {
    id: "music",
    label: "Music",
    keywords: ["music", "musician", "composer", "song", "album"],
    children: [
      { id: "music-classical", label: "Classical & opera", keywords: ["composer", "orchestra", "symphony", "opera", "concerto"] },
      { id: "music-popular", label: "Pop & rock", keywords: ["rock music", "pop music", "band", "album", "singer"] },
      { id: "music-jazz", label: "Jazz & blues", keywords: ["jazz", "blues", "improvisation", "big band"] },
      { id: "music-instruments", label: "Instruments", keywords: ["piano", "violin", "guitar", "instrument", "orchestra"] },
      { id: "music-recording", label: "Recording & industry", keywords: ["record label", "recording studio", "gramophone", "vinyl", "billboard"] },
    ],
  },
  {
    id: "disasters",
    label: "Disasters & accidents",
    keywords: ["disaster", "accident", "crash", "shipwreck", "explosion"],
    children: [
      { id: "disasters-transport", label: "Transport crashes", keywords: ["plane crash", "train wreck", "shipwreck", "sinking", "collision"] },
      { id: "disasters-natural", label: "Natural disasters", keywords: ["earthquake", "volcano", "hurricane", "tsunami", "flood", "wildfire"] },
      { id: "disasters-industrial", label: "Industrial accidents", keywords: ["explosion", "mine disaster", "oil spill", "nuclear accident", "factory fire"] },
      { id: "disasters-fires", label: "Fires & collapses", keywords: ["fire", "building collapse", "bridge collapse", "blaze"] },
      { id: "disasters-maritime", label: "Shipwrecks", keywords: ["shipwreck", "sinking", "maritime disaster", "titanic", "lifeboat"] },
    ],
  },
  {
    id: "invention",
    label: "Invention & tech",
    keywords: ["invented", "invention", "patent", "engineer", "technology"],
    children: [
      { id: "invention-gadgets", label: "Odd inventions", keywords: ["invented", "invention", "patent", "gadget", "prototype"] },
      { id: "invention-computing", label: "Computing", keywords: ["computer", "algorithm", "software", "internet", "programming"] },
      { id: "invention-engineering", label: "Engineering feats", keywords: ["engineer", "bridge", "tunnel", "skyscraper", "machinery"] },
      { id: "invention-science", label: "Discoveries", keywords: ["discovered", "experiment", "laboratory", "scientist", "physics"] },
      { id: "invention-communication", label: "Communication", keywords: ["telephone", "telegraph", "radio", "television", "satellite"] },
      { id: "invention-transport", label: "Vehicles", keywords: ["automobile", "locomotive", "airplane", "steam engine", "bicycle"] },
    ],
  },
  {
    id: "science",
    label: "Science & space",
    keywords: ["science", "scientist", "physics", "chemistry", "astronomy"],
    children: [
      { id: "science-space", label: "Astronomy & space", keywords: ["astronomy", "planet", "galaxy", "telescope", "cosmos", "nasa"] },
      { id: "science-physics", label: "Physics", keywords: ["physics", "quantum", "relativity", "particle", "gravity"] },
      { id: "science-chem", label: "Chemistry", keywords: ["chemistry", "chemical", "element", "molecule", "compound"] },
      { id: "science-bio", label: "Biology", keywords: ["biology", "genetics", "evolution", "organism", "dna"] },
      { id: "science-earth", label: "Earth science", keywords: ["geology", "climate", "oceanography", "atmosphere", "fossil"] },
    ],
  },
  {
    id: "exploration",
    label: "Exploration & travel",
    keywords: ["exploration", "expedition", "voyage", "explorer", "navigator"],
    children: [
      { id: "explore-sea", label: "Sea voyages", keywords: ["voyage", "ship", "navy", "sailor", "ocean", "circumnavig"] },
      { id: "explore-polar", label: "Polar & mountains", keywords: ["arctic", "antarctic", "expedition", "mount everest", "polar"] },
      { id: "explore-space", label: "Spaceflight", keywords: ["astronaut", "spacecraft", "nasa", "orbit", "moon landing"] },
      { id: "explore-maps", label: "Maps & discovery", keywords: ["explorer", "cartograph", "discovered", "expedition", "colony"] },
      { id: "explore-aviation", label: "Aviation", keywords: ["aviator", "flight", "airplane", "pilot", "airship", "zeppelin"] },
    ],
  },
  {
    id: "odd-history",
    label: "Odd history",
    keywords: ["history", "historical", "century", "medieval", "ancient"],
    children: [
      { id: "odd-ancient", label: "Ancient world", keywords: ["ancient", "roman", "greek", "egypt", "mesopotamia", "pharaoh"] },
      { id: "odd-medieval", label: "Medieval", keywords: ["medieval", "knight", "castle", "middle ages", "viking"] },
      { id: "odd-crime", label: "Crime & intrigue", keywords: ["assassination", "espionage", "heist", "trial", "scandal", "murder"] },
      { id: "odd-customs", label: "Customs & quirks", keywords: ["tradition", "ritual", "ceremony", "folklore", "legend"] },
      { id: "odd-royalty", label: "Royalty & courts", keywords: ["king", "queen", "emperor", "royal", "palace", "dynasty"] },
      { id: "odd-everyday", label: "Everyday life", keywords: ["household", "fashion history", "cuisine history", "street", "merchant"] },
    ],
  },
  {
    id: "nature",
    label: "Nature & animals",
    keywords: ["animal", "species", "wildlife", "biology", "extinct"],
    children: [
      { id: "nature-animals", label: "Animals", keywords: ["animal", "mammal", "bird", "reptile", "species", "zoo"] },
      { id: "nature-ocean", label: "Ocean life", keywords: ["whale", "shark", "coral", "marine", "ocean", "fish"] },
      { id: "nature-plants", label: "Plants & ecology", keywords: ["plant", "forest", "ecology", "botanical", "tree", "fungus"] },
      { id: "nature-extinct", label: "Extinct & fossils", keywords: ["extinct", "fossil", "dinosaur", "paleontol", "prehistoric"] },
      { id: "nature-insects", label: "Insects", keywords: ["insect", "butterfly", "bee", "beetle", "ant", "spider"] },
    ],
  },
  {
    id: "arts",
    label: "Arts & makers",
    keywords: ["art", "artist", "painting", "museum", "sculpture"],
    children: [
      { id: "arts-visual", label: "Visual art", keywords: ["painting", "sculpture", "artist", "museum", "gallery"] },
      { id: "arts-literature", label: "Literature", keywords: ["novel", "poem", "author", "writer", "playwright", "literature"] },
      { id: "arts-design", label: "Design & craft", keywords: ["architect", "design", "craft", "furniture", "typography"] },
      { id: "arts-architecture", label: "Architecture", keywords: ["architecture", "building", "cathedral", "skyscraper", "architect"] },
      { id: "arts-theatre", label: "Theatre & dance", keywords: ["theatre", "theater", "ballet", "playwright", "broadway", "dance"] },
    ],
  },
  {
    id: "food",
    label: "Food & drink",
    keywords: ["food", "cuisine", "cooking", "recipe", "restaurant"],
    children: [
      { id: "food-cuisine", label: "Cuisines", keywords: ["cuisine", "culinary", "cookbook", "chef", "restaurant"] },
      { id: "food-ingredients", label: "Ingredients", keywords: ["spice", "ingredient", "crop", "harvest", "fermentation"] },
      { id: "food-drink", label: "Drinks", keywords: ["wine", "beer", "coffee", "tea", "cocktail", "distillery"] },
      { id: "food-history", label: "Food history", keywords: ["food history", "banquet", "feast", "cookbook", "gastronomy"] },
    ],
  },
  {
    id: "sports",
    label: "Sports & games",
    keywords: ["sport", "athlete", "championship", "olympic", "tournament"],
    children: [
      { id: "sports-olympics", label: "Olympics", keywords: ["olympic", "olympics", "medal", "athlete"] },
      { id: "sports-ball", label: "Ball sports", keywords: ["football", "soccer", "baseball", "basketball", "cricket", "tennis"] },
      { id: "sports-racing", label: "Racing", keywords: ["race", "formula one", "nascar", "marathon", "regatta"] },
      { id: "sports-games", label: "Games & toys", keywords: ["board game", "chess", "videogame", "video game", "toy", "puzzle"] },
    ],
  },
  {
    id: "conflict",
    label: "War & conflict",
    keywords: ["war", "battle", "military", "army", "siege"],
    children: [
      { id: "war-battles", label: "Battles", keywords: ["battle", "siege", "campaign", "offensive", "warfare"] },
      { id: "war-weapons", label: "Weapons & tech", keywords: ["weapon", "artillery", "tank", "warship", "missile"] },
      { id: "war-people", label: "People & strategy", keywords: ["general", "admiral", "soldier", "strategy", "treaty"] },
      { id: "war-home", label: "Home front", keywords: ["propaganda", "resistance", "occupation", "civilian", "refugee"] },
      { id: "war-naval", label: "Naval warfare", keywords: ["navy", "battleship", "submarine", "fleet", "naval battle"] },
    ],
  },
  {
    id: "places",
    label: "Places & landmarks",
    keywords: ["city", "landmark", "building", "monument", "island"],
    children: [
      { id: "places-cities", label: "Cities", keywords: ["city", "capital", "metropolis", "town", "borough"] },
      { id: "places-landmarks", label: "Landmarks", keywords: ["monument", "statue", "palace", "cathedral", "landmark"] },
      { id: "places-islands", label: "Islands & coasts", keywords: ["island", "peninsula", "archipelago", "coast", "harbor"] },
      { id: "places-buildings", label: "Buildings", keywords: ["building", "tower", "bridge", "stadium", "skyscraper"] },
      { id: "places-regions", label: "Regions & nations", keywords: ["country", "kingdom", "empire", "province", "colony"] },
    ],
  },
  {
    id: "people",
    label: "People & culture",
    keywords: ["biography", "born", "activist", "philosopher", "politician"],
    children: [
      { id: "people-leaders", label: "Leaders & politics", keywords: ["president", "prime minister", "politician", "statesman", "parliament"] },
      { id: "people-thinkers", label: "Thinkers", keywords: ["philosopher", "scientist", "inventor", "scholar", "theorist"] },
      { id: "people-activism", label: "Activism & rights", keywords: ["activist", "suffrage", "civil rights", "abolition", "protest"] },
      { id: "people-language", label: "Language & words", keywords: ["language", "etymology", "dictionary", "alphabet", "dialect"] },
      { id: "people-myth", label: "Myth & religion", keywords: ["mythology", "gods", "temple", "ritual", "religion", "saint"] },
    ],
  },
  {
    id: "medicine",
    label: "Medicine & body",
    keywords: ["medicine", "medical", "doctor", "hospital", "disease"],
    children: [
      { id: "med-history", label: "Medical history", keywords: ["physician", "surgeon", "hospital", "medical", "anatomy"] },
      { id: "med-disease", label: "Disease & epidemics", keywords: ["epidemic", "pandemic", "plague", "vaccine", "disease"] },
      { id: "med-discovery", label: "Treatments", keywords: ["vaccine", "antibiotic", "surgery", "anesthesia", "penicillin"] },
      { id: "med-body", label: "Human body", keywords: ["anatomy", "brain", "heart", "skeleton", "physiology"] },
    ],
  },
];

export const DEFAULT_LEAVES = INTEREST_TREE.flatMap((parent) =>
  parent.children.map((child) => ({
    ...child,
    parentId: parent.id,
    parentLabel: parent.label,
  }))
);

export function findParent(parentId) {
  return INTEREST_TREE.find((item) => item.id === parentId) || null;
}

export function findDefaultLeaf(id) {
  return DEFAULT_LEAVES.find((item) => item.id === id) || null;
}

export function childIdsForParent(parentId) {
  const parent = findParent(parentId);
  return parent ? parent.children.map((child) => child.id) : [];
}
