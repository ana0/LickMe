// Firebase Configuration
// IMPORTANT: The actual config values should be in firebase-config.private.js
// Load firebase-config.private.js BEFORE this file in your HTML
// Example: <script src="../shared/firebase-config.private.js"></script>

// Use config from private file if available, otherwise use placeholder values
const firebaseConfig = window.FIREBASE_CONFIG_PRIVATE || {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Warn if using placeholder values
if (!window.FIREBASE_CONFIG_PRIVATE) {
  console.warn('⚠️ Firebase config not found! Create firebase-config.private.js with your project credentials.');
}

// Initialize Firebase and sign in anonymously
async function initFirebase() {
  firebase.initializeApp(firebaseConfig);
  try {
    await firebase.auth().signInAnonymously();
    console.log('Signed in anonymously');
    return true;
  } catch (error) {
    console.error('Auth error:', error);
    return false;
  }
}


// Shared constants
const CONFIG = {
  // Each set is a triptych (3 images shown left to right)
ARTWORK_SETS: [
  [
    "/collections/1/img-01.png",
    "/collections/1/img-02.png",
    "/collections/1/img-03.png",
  ],
  [
    "/collections/2/img-01.png",
    "/collections/2/img-02.png",
    "/collections/2/img-03.png",
  ],
  [
    "/collections/3/img-01.png",
    "/collections/3/img-02.png",
    "/collections/3/img-03.png",
  ],
  [
    "/collections/4/img-01.png",
    "/collections/4/img-02.png",
    "/collections/4/img-03.png",
  ],
  [
    "/collections/5/img-01.png",
    "/collections/5/img-02.png",
    "/collections/5/img-03.png",
  ],
  [
    "/collections/6/img-01.png",
    "/collections/6/img-02.png",
    "/collections/6/img-03.png",
  ],
  [
    "/collections/7/img-01.png",
    "/collections/7/img-02.png",
    "/collections/7/img-03.png",
  ],
  [
    "/collections/8/img-01.png",
    "/collections/8/img-02.png",
    "/collections/8/img-03.png",
  ],
  [
    "/collections/9/img-01.png",
    "/collections/9/img-02.png",
    "/collections/9/img-03.png",
  ],
  [
    "/collections/10/img-01.png",
    "/collections/10/img-02.png",
    "/collections/10/img-03.png",
  ],
  [
    "/collections/11/img-01.png",
    "/collections/11/img-02.png",
    "/collections/11/img-03.png",
  ],
  [
    "/collections/12/img-01.png",
    "/collections/12/img-02.png",
    "/collections/12/img-03.png",
  ],
  [
    "/collections/13/img-01.png",
    "/collections/13/img-02.png",
    "/collections/13/img-03.png",
  ],
  [
    "/collections/14/img-01.png",
    "/collections/14/img-02.png",
    "/collections/14/img-03.png",
  ],
  [
    "/collections/15/img-01.png",
    "/collections/15/img-02.png",
    "/collections/15/img-03.png",
  ],
  [
    "/collections/16/img-01.png",
    "/collections/16/img-02.png",
    "/collections/16/img-03.png",
  ],
  [
    "/collections/17/img-01.png",
    "/collections/17/img-02.png",
    "/collections/17/img-03.png",
  ],
  [
    "/collections/18/img-01.png",
    "/collections/18/img-02.png",
    "/collections/18/img-03.png",
  ],
  [
    "/collections/19/img-01.png",
    "/collections/19/img-02.png",
    "/collections/19/img-03.png",
  ],
],

  ARTIFACTS: [
    {
      title: "Jewelry, The Thief of Bagdad Brooches",
      description:
        'Brooches inspired by situations in the film The Thief of Bagdad. One brooch features a man with a turban sitting around a crystal ball; the other depicts a man holding an oil lamp. Text on the back of both reads, "Thief of Bagdad / Korda."',
      relatedProduction: "The Thief of Bagdad (1940)",
      material: ["Metal"],
      dimensions: "1.5 x 3.5",
      date: "ca. 1940",
      number: "1987.005.0001-.0002",
      credit: null,
      creatorMaker: []
    },
    {
      title: "Dixie Ice Cream Lid featuring Irene Dunne",
      description:
        'Dixie ice-cream cup lid featuring a portrait of Irene Dunne. Text on the lid reads, "Playing in \'My Favorite Wife\' / An R.K.O. Picture / Irene Dunne."',
      relatedProduction: "My Favorite Wife (1940)",
      material: ["Paper"],
      dimensions: '2.75" Diameter',
      date: "1940",
      number: "2005.018.0533",
      credit:
        "Gift of Rosemary Van Peymbrock in memory of Clara Vieau Van Peymbroeck",
      creatorMaker: [
        { name: "Bridgeman-Russell Co.", role: "Distributor" },
        { name: "Dixie Cup Company", role: "Manufacturer" }
      ]
    },
    {
      title: "Marionette, Small Fry Club",
      description:
        'Marionette based on a character from the television series Small Fry Club. This 14.5" marionette has a plaid patchwork cloth body, composition hands and head, and wooden feet. The program\'s title and two stars are printed onto a piece of yellow felt that is sewn to the figure\'s chest.',
      relatedProduction: "Small Fry Club (1947-1951)",
      material: ["Textile", "Wood", "Composition"],
      dimensions: "13.5 x 6 x 3",
      date: "ca. 1950",
      number: "1991.001.0005c-d",
      credit: "Purchased by Rochelle Slovin",
      creatorMaker: [{ name: "Peter Puppet Playthings", role: "Manufacturer" }]
    },
    {
      title: "Doll, Jean Darling from Our Gang",
      description:
        'Doll based on the character Jean Darling as she appears in the Our Gang short film series. The 11" doll is dressed in an orange felt jacket with bow and purple felt pants. The doll has a composition head with hand painted features and a blond, braided wig. Hands and torso are stuffed fabric, and the feet are tin plated metal. The doll is fitted with a wind-up mechanism that is activated by a crank in its back.',
      relatedProduction: "Our Gang Film Series (1922-1944)",
      material: ["Composition", "Textile", "Metal"],
      dimensions: '11" H x 5.75" W x 3.25" D',
      date: "ca. 1927",
      number: "2001.019.0169",
      credit: "Gift of Gary and Dana Stein",
      historicNote:
        "Because this figure is not with its original packaging, it is difficult to determine exactly when it was produced and released to the public. The character Jean Darling starred in the series between the years of 1927 and 1929. Therefore, it is most likely that this series of dolls produced by the Sayco Doll Corporation (which also included Joe Cobb and Farina) was released sometime between 1927 and 1929.",
      creatorMaker: [
        { name: "Hal Roach Studios", role: "Licensor" },
        { name: "Sayco Doll Corporation", role: "Manufacturer" }
      ]
    },
    {
      title: "Doll, Farina",
      description:
        'Doll based on the character Farina as he appears in early episodes of the Our Gang short film series. The 12.5" doll is dressed in a white cotton shirt, purple felt jacket with button closure, and orange felt pants. The doll has composition hands and head, with hand painted features. The limbs and torso are tinplate armature with some padding. The doll is fitted with a wind-up mechanism that is activated by a crank in its back.',
      relatedProduction: "Our Gang Film Series (1922-1944)",
      material: ["Composition", "Textile", "Metal"],
      dimensions: '12.25" H x 7" W x 2.75" D',
      date: "ca. 1927",
      number: "2001.019.0167",
      credit: "Gift of Gary and Dana Stein",
      historicNote:
        "Because this figure is not with its original packaging, it is difficult to determine exactly when it was produced and released to the public. The character Farina was seen in the earliest Our Gang films, starring in the series between 1922 and 1931. However, the other dolls which were released alongside the Farina doll by the Sayco Doll Corporation (Joe Cobb and Jean Darling) were based on characters whose collective roles only overlapped during the years 1927-1929. Therefore, it is most likely that this series of dolls was produced sometime between 1927 and 1929.",
      creatorMaker: [
        { name: "Sayco Doll Corporation", role: "Manufacturer" },
        { name: "Hal Roach Studios", role: "Licensor" }
      ]
    },
    {
      title: "Pola Negri Souvenir Spoon",
      description:
        'Silver-plated spoon stamped with an image of Pola Negri at the top of the handle. Negri\'s name appears below her portrait and her signature is stamped on the spoon handle. The reverse of the spoon\'s handle is stamped with the words "Oneida Community Par Plate."',
      relatedProduction: "Photoplay",
      material: ["Metal"],
      dimensions: '6" H x 1.5" W',
      date: "1925",
      number: "1990.032.0005",
      credit: "Gift of Robert J. Devenney",
      historicNote:
        "In 1925 Photoplay commissioned this spoon from the Oneida silverware manufacturer as part of a set of twelve. Each spoon depicted a popular film star of the era. The souvenirs, available directly from Photoplay, were popular with the magazine's readers.",
      creatorMaker: [{ name: "Oneida Community", role: "Manufacturer" }],
      dateNote:
        'Source text also includes "ca. 1920" but conflicts with the 1925 note.'
    },
    {
      title: "Table game, Home Screen Test",
      description:
        'Home Screen Test table game. The box lid features an illustration of a group of people playing the game, along with the text, "Home Screen Test / Entertainment and Amusement for Home and Party / Your score was only 60 points on that last imitation / Now register joy! / What is your A.A. (Acting Ability)? / How do you rate as an Entertainer?" Contents include: a large mat with a square cutout, game instructions, and four score cards.',
      relatedProduction: null,
      material: ["Paper"],
      dimensions: "12.5 x 15",
      date: "1937",
      number: "1987.096.0066",
      credit: "Gift of Glenn Ralston",
      creatorMaker: [{ name: "American Toy Works", role: "Manufacturer" }]
    },
    {
      title: "Toys, Kolor-Kraft Our Gang Paint Set",
      description:
        'Kolor-Kraft Our Gang paint set. The set includes six black-and-white cardboard cutouts of the characters Jacqueline, Scotty, Spanky, Pete (the dog), Stymie, and Tommy, six colors of paint, instructions on mixing colors, and one paintbrush. Also included are stands for each of the cutouts. Text on the box cover reads, "Kolor-Kraft / Metro-Goldwyn-Mayer Pictures present / Our Gang / in Hal Roach Our Gang Comedies / Set of Six Cutout Figures of your Favorite Movie Stars Complete with Paint, Brush, and Bases."',
      relatedProduction: "Our Gang Film Series (1922-1944)",
      material: ["Paper"],
      dimensions: '12" H x 14.5" W x 2" D',
      date: "1934",
      number: "2001.019.0014a-j",
      credit: "Gift of Gary and Dana Stein",
      creatorMaker: [
        { name: "Kolor-Kraft Products, Inc.", role: "Manufacturer" },
        { name: "Hal Roach Studios", role: "Licensor" }
      ]
    },
    {
      title: "Charlie Chaplin Pencil Box",
      description:
        'Pencil box featuring an illustration of the character known as the Tramp (Charlie Chaplin). The signature of artist Henry Clive appears on the lower right corner of the lid. The box contains four wooden pencils with patterned paper covers and a pencil sharpener.',
      relatedProduction: null,
      material: ["Metal"],
      dimensions: '7.75" H x 2" W x 1" D',
      date: "1931",
      number: "1982.252a-f",
      credit: null,
      creatorMaker: [
        { name: "Canco Beautebox", role: "Manufacturer" },
        { name: "Henry Clive", role: "Illustrator" }
      ]
    },
    {
      title: "Paper doll, Charlie Chaplin",
      description:
        'Paper doll depicting the character "The Tramp" as portrayed by the actor Charlie Chaplin. This 13" illustrated paper doll has riveted hip and knee joints that allow movement.',
      relatedProduction: null,
      material: ["Paper", "Metal"],
      dimensions: "12.5 x 5.5",
      date: "ca. 1925",
      number: "1985.007.0130",
      credit: "Gift of Jane Scovell",
      creatorMaker: []
    },
    {
      title: "Jacket, The Scarlet Letter",
      description:
        'Jacket from the film The Scarlet Letter. The 17th century-style jacket is made of cordovan wool/cotton faille, and has a natural waist, hip-length skirt, and shoulder flanges. There are three molded brown cuff buttons on each arm, and eight black buttons down the front (unmatched). Vertical white cotton braid flanks the front button closure. The jacket has a brown cotton calendered twill lining.',
      relatedProduction: "The Scarlet Letter (1927)",
      material: ["Textile"],
      dimensions: 'Waist: 33"',
      date: "1926",
      number: "1981.267",
      credit: "Gift of Daniel Geoly, Eaves-Brooks Costume Company",
      creatorMaker: [{ name: "Eaves Costume Company", role: "Manufacturer" }]
    },
    {
      title: "Jacket, Monsieur Beaucaire",
      description:
        "Eighteenth-century-style jacket from the film Monsieur Beaucaire. The jacket is orange satin with six buttons along each side of the front. Tassels are attached to all but the top two buttons. The sleeves have wide satin and lace cuffs, which are also decorated with tasseled buttons.",
      relatedProduction: "Monsieur Beaucaire (1924)",
      material: ["Textile"],
      dimensions: null,
      date: "1924",
      number: "1981.159",
      credit: "Gift of Daniel Geoly, Eaves-Brooks Costume Company",
      historicNote:
        "Natacha Rambova was the Production Designer and Costume Designer for the film Monsieur Beaucaire. Georges Barbier, a well-known French designer, acted as illustrator, and created sketches for many of the elaborate costumes seen in the film, including this jacket.",
      creatorMaker: [
        { name: "Georges Barbier", role: "Designer" },
        { name: "Natacha Rambova", role: "Designer" }
      ]
    },
    {
      title: "Socks, Betty Boop",
      description:
        'Socks inspired by the cartoon character Betty Boop as she appears in the 1930\'s Max Fleischer Betty Boop and Talkartoons film series. These ribbed, white cotton socks have a yellow tag attached to their fold-over cuffs that is illustrated with a color picture of Betty Boop and the words "Betty Boop Hosiery."',
      relatedProduction:
        "Betty Boop and Talkartoons film series (Max Fleischer, 1930s)",
      material: ["Textile", "Paper"],
      dimensions: "10 x 5",
      date: "ca. 1931",
      number: "1992.007.0002",
      credit: null,
      creatorMaker: [],
      dateNote: 'Source text also repeats "1931" separately.'
    },
    {
      title: "Preview slide, Homeward Bound",
      description:
        'Preview slide for the film Homeward Bound. The slide includes a still from the film depicting Thomas Meighan along with text that reads, "A Paramount Picture / Adolph Zukor presents / Thomas Meighan / in a Peter B. Kyne story / Homeward Bound / Based on \'The Light Leeward\' Screen play by Jack Cunningham / Directed by Ralph Ince." Below the image is a framed space for theater-specific information.',
      relatedProduction: "Homeward Bound (1923)",
      material: ["Glass"],
      dimensions: "3.25 x 4",
      date: "1923",
      number: "1982.213.0006",
      credit: "Gift of Glenn Ralston",
      creatorMaker: [{ name: "Excelsior Illustrating Co.", role: "Manufacturer" }]
    },
    {
      title: "Marilyn Monroe High Heel Shoes",
      description:
        'High heel shoes inspired by the film star Marilyn Monroe. These 2" turquoise leather heels are tied at the base of the ankle in a bow, and Monroe\'s signature is printed on their insoles.',
      relatedProduction: null,
      material: ["Leather", "Plastic"],
      dimensions: '4" H x 3" W x 9" D',
      date: "1967",
      number: "1987.076.0004a-b",
      credit: null,
      creatorMaker: [
        { name: "The Estate of Marilyn Monroe", role: "Licensor" },
        { name: "The Thom McAn Shoe Company", role: "Manufacturer" }
      ],
      dateNote: "Source text also includes 1986; date is inconsistent."
    },
    {
      title: "Activity book, Margaret O'Brien Paint Book",
      description:
        "Coloring book featuring Margaret O'Brien. This book contains line drawings of O'Brien as she appeared in films of the 1940s. She is pictured on the book's full-color cover with a kitten on her shoulder.",
      relatedProduction: null,
      material: ["Paper"],
      dimensions: "15.25 x 11",
      date: "1947",
      number: "1988.006.0049",
      credit: null,
      creatorMaker: [
        { name: "Metro-Goldwyn-Mayer", role: "Licensor" },
        { name: "Whitman Publishing Company", role: "Publisher" }
      ]
    }
  ],
  // Timing
  OBJKT_POLL_INTERVAL_MS: 5000, // Poll Objkt.com every 5 seconds for sales
  PIXEL_CLEANUP_AGE_MS: 15000, // Clean pixels older than 15 seconds

  // Objkt.com API
  OBJKT_GRAPHQL_ENDPOINT: 'https://data.objkt.com/v3/graphql',

  // Visual settings
  PIXEL_SIZE: 4,
  WHITE_TO_BLACK_MS: 5000,
  BURN_THROUGH_MS: 10000,

  // Screen viewport configs
  // Each screen shows a zoomed-in portion of one triptych image.
  // imageIndex: which of the 3 triptych images (0, 1, or 2)
  // viewportX/Y: top-left corner of the viewport as fraction of full image (0-1)
  // viewportWidth/Height: size of the viewport as fraction of full image (0-1)
  SCREEN_CONFIGS: [
    // Screen 1: iPad landscape — zoomed section of image 1
    { imageIndex: 0, viewportX: 0.2, viewportY: 0.2, viewportWidth: 0.6, viewportHeight: 0.6 },
    // Screen 2: iPad landscape — left portion of image 2
    { imageIndex: 1, viewportX: 0.0, viewportY: 0.2, viewportWidth: 0.5, viewportHeight: 0.6 },
    // Screen 3: iPad landscape — right portion of image 2
    { imageIndex: 1, viewportX: 0.5, viewportY: 0.2, viewportWidth: 0.5, viewportHeight: 0.6 },
    // Screen 4: iPhone 11 portrait — narrow section of image 3
    { imageIndex: 2, viewportX: 0.35, viewportY: 0.15, viewportWidth: 0.3, viewportHeight: 0.7 },
  ]
};
