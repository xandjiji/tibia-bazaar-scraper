const { dictionaryFactory } = require('../utils')

export const tokens = [
    {
        name: "Widow Queen",
        id: {
            male: 368,
            female: 368
        }
    },
    {
        name: "Racing Bird",
        id: {
            male: 369,
            female: 369
        }
    },
    {
        name: "War Bear",
        id: {
            male: 370,
            female: 370
        }
    },
    {
        name: "Black Sheep",
        id: {
            male: 371,
            female: 371
        }
    },
    {
        name: "Midnight Panther",
        id: {
            male: 372,
            female: 372
        }
    },
    {
        name: "Draptor",
        id: {
            male: 373,
            female: 373
        }
    },
    {
        name: "Titanica",
        id: {
            male: 374,
            female: 374
        }
    },
    {
        name: "Tin Lizzard",
        id: {
            male: 375,
            female: 375
        }
    },
    {
        name: "Blazebringer",
        id: {
            male: 376,
            female: 376
        }
    },
    {
        name: "Rapid Boar",
        id: {
            male: 377,
            female: 377
        }
    },
    {
        name: "Stampor",
        id: {
            male: 378,
            female: 378
        }
    },
    {
        name: "Undead Cavebear",
        id: {
            male: 379,
            female: 379
        }
    },
    {
        name: "Donkey",
        id: {
            male: 387,
            female: 387
        }
    },
    {
        name: "Tiger Slug",
        id: {
            male: 388,
            female: 388
        }
    },
    {
        name: "Uniwheel",
        id: {
            male: 389,
            female: 389
        }
    },
    {
        name: "Crystal Wolf",
        id: {
            male: 390,
            female: 390
        }
    },
    {
        name: "War Horse",
        id: {
            male: 392,
            female: 392
        }
    },
    {
        name: "Kingly Deer",
        id: {
            male: 401,
            female: 401
        }
    },
    {
        name: "Tamed Panda",
        id: {
            male: 402,
            female: 402
        }
    },
    {
        name: "Dromedary",
        id: {
            male: 405,
            female: 405
        }
    },
    {
        name: "Scorpion King",
        id: {
            male: 406,
            female: 406
        }
    },
    {
        name: "Lady Bug",
        id: {
            male: 447,
            female: 447
        }
    },
    {
        name: "Manta Ray",
        id: {
            male: 450,
            female: 450
        }
    },
    {
        name: "Ironblight",
        id: {
            male: 502,
            female: 502
        }
    },
    {
        name: "Magma Crawler",
        id: {
            male: 503,
            female: 503
        }
    },
    {
        name: "Dragonling",
        id: {
            male: 506,
            female: 506
        }
    },
    {
        name: "Gnarlhound",
        id: {
            male: 515,
            female: 515
        }
    },
    {
        name: "Water Buffalo",
        id: {
            male: 526,
            female: 526
        }
    },
    {
        name: "Ursagrodon",
        id: {
            male: 548,
            female: 548
        }
    },
    {
        name: "The Hellgrip",
        id: {
            male: 559,
            female: 559
        }
    },
    {
        name: "Noble Lion",
        id: {
            male: 571,
            female: 571
        }
    },
    {
        name: "Shock Head",
        id: {
            male: 580,
            female: 580
        }
    },
    {
        name: "Walker",
        id: {
            male: 606,
            female: 606
        }
    },
    {
        name: "Glooth Glider",
        id: {
            male: 682,
            female: 682
        }
    },
    {
        name: "Rift Runner",
        id: {
            male: 848,
            female: 848
        }
    },
    {
        name: "Sparkion",
        id: {
            male: 883,
            female: 883
        }
    },
    {
        name: "Neon Sparkid",
        id: {
            male: 889,
            female: 889
        }
    },
    {
        name: "Vortexion",
        id: {
            male: 890,
            female: 890
        }
    },
    {
        name: "Stone Rhino",
        id: {
            male: 937,
            female: 937
        }
    },
    {
        name: "Mole",
        id: {
            male: 1049,
            female: 1049
        }
    },
    {
        name: "Fleeting Knowledge",
        id: {
            male: 1101,
            female: 1101
        }
    },
    {
        name: "Lacewing Moth",
        id: {
            male: 1150,
            female: 1150
        }
    },
    {
        name: "Hibernal Moth",
        id: {
            male: 1151,
            female: 1151
        }
    },
    {
        name: "Cold Percht Sleigh",
        id: {
            male: 1163,
            female: 1163
        }
    },
    {
        name: "Bright Percht Sleigh",
        id: {
            male: 1164,
            female: 1164
        }
    },
    {
        name: "Dark Percht Sleigh",
        id: {
            male: 1165,
            female: 1165
        }
    },
    {
        name: "Gryphon",
        id: {
            male: 1191,
            female: 1191
        }
    },
    {
        name: "Cold Percht Sleigh Variant",
        id: {
            male: 1229,
            female: 1229
        }
    },
    {
        name: "Bright Percht Sleigh Variant",
        id: {
            male: 1230,
            female: 1230
        }
    },
    {
        name: "Dark Percht Sleigh Variant",
        id: {
            male: 1231,
            female: 1231
        }
    },
    {
        name: "Finished Cold Percht Sleigh",
        id: {
            male: 1232,
            female: 1232
        }
    },
    {
        name: "Finished Bright Percht Sleigh",
        id: {
            male: 1233,
            female: 1233
        }
    },
    {
        name: "Finished Dark Percht Sleigh",
        id: {
            male: 1234,
            female: 1234
        }
    },
    {
        name: "Blue Rolling Barrel",
        id: {
            male: 1257,
            female: 1257
        }
    },
    {
        name: "Red Rolling Barrel",
        id: {
            male: 1258,
            female: 1258
        }
    },
    {
        name: "Green Rolling Barrel",
        id: {
            male: 1259,
            female: 1259
        }
    },
    {
        name: "Haze",
        id: {
            male: 1269,
            female: 1269
        }
    },
    {
        name: "Antelope",
        id: {
            male: 1281,
            female: 1281
        }
    },
    {
        name: "Phantasmal Jade",
        id: {
            male: 1321,
            female: 1321
        }
    },
    {
        name: "White Lion",
        id: {
            male: 1336,
            female: 1336
        }
    },
    {
        name: "Krakoloss",
        id: {
            male: 1363,
            female: 1363
        }
    },
    {
        name: "Phant",
        id: {
            male: 1417,
            female: 1417
        }
    },
    {
        name: "Shellodon",
        id: {
            male: 1430,
            female: 1430
        }
    },
    {
        name: "Singeing Steed",
        id: {
            male: 1431,
            female: 1431
        }
    }
]

export const dictionary = dictionaryFactory(tokens)
