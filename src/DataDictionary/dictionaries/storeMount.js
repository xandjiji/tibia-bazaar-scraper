const { dictionaryFactory } = require('../utils')

export const tokens = [
    {
        name: "Armoured War Horse",
        id: {
            male: 426,
            female: 426
        }
    },
    {
        name: "Shadow Draptor",
        id: {
            male: 427,
            female: 427
        }
    },
    {
        name: "Crimson Ray",
        id: {
            male: 521,
            female: 521
        }
    },
    {
        name: "Steelbeak",
        id: {
            male: 522,
            female: 522
        }
    },
    {
        name: "Tombstinger",
        id: {
            male: 546,
            female: 546
        }
    },
    {
        name: "Platesaurian",
        id: {
            male: 547,
            female: 547
        }
    },
    {
        name: "Desert King",
        id: {
            male: 572,
            female: 572
        }
    },
    {
        name: "Azudocus",
        id: {
            male: 621,
            female: 621
        }
    },
    {
        name: "Carpacosaurus",
        id: {
            male: 622,
            female: 622
        }
    },
    {
        name: "Death Crawler",
        id: {
            male: 624,
            female: 624
        }
    },
    {
        name: "Flamesteed",
        id: {
            male: 626,
            female: 626
        }
    },
    {
        name: "Jade Lion",
        id: {
            male: 627,
            female: 627
        }
    },
    {
        name: "Jade Pincer",
        id: {
            male: 628,
            female: 628
        }
    },
    {
        name: "Nethersteed",
        id: {
            male: 629,
            female: 629
        }
    },
    {
        name: "Tempest",
        id: {
            male: 630,
            female: 630
        }
    },
    {
        name: "Winter King",
        id: {
            male: 631,
            female: 631
        }
    },
    {
        name: "Doombringer",
        id: {
            male: 644,
            female: 644
        }
    },
    {
        name: "Woodland Prince",
        id: {
            male: 647,
            female: 647
        }
    },
    {
        name: "Hailstorm Fury",
        id: {
            male: 648,
            female: 648
        }
    },
    {
        name: "Siegebreaker",
        id: {
            male: 649,
            female: 649
        }
    },
    {
        name: "Poisonbane",
        id: {
            male: 650,
            female: 650
        }
    },
    {
        name: "Blackpelt",
        id: {
            male: 651,
            female: 651
        }
    },
    {
        name: "Golden Dragonfly",
        id: {
            male: 669,
            female: 669
        }
    },
    {
        name: "Steel Bee",
        id: {
            male: 670,
            female: 670
        }
    },
    {
        name: "Copper Fly",
        id: {
            male: 671,
            female: 671
        }
    },
    {
        name: "Tundra Rambler",
        id: {
            male: 672,
            female: 672
        }
    },
    {
        name: "Highland Yak",
        id: {
            male: 673,
            female: 673
        }
    },
    {
        name: "Glacier Vagabond",
        id: {
            male: 674,
            female: 674
        }
    },
    {
        name: "Shadow Hart",
        id: {
            male: 685,
            female: 685
        }
    },
    {
        name: "Black Stag",
        id: {
            male: 686,
            female: 686
        }
    },
    {
        name: "Emperor Deer",
        id: {
            male: 687,
            female: 687
        }
    },
    {
        name: "Flying Divan",
        id: {
            male: 688,
            female: 688
        }
    },
    {
        name: "Magic Carpet",
        id: {
            male: 689,
            female: 689
        }
    },
    {
        name: "Floating Kashmir",
        id: {
            male: 690,
            female: 690
        }
    },
    {
        name: "Ringtail Waccoon",
        id: {
            male: 691,
            female: 691
        }
    },
    {
        name: "Night Waccoon",
        id: {
            male: 692,
            female: 692
        }
    },
    {
        name: "Emerald Waccoon",
        id: {
            male: 693,
            female: 693
        }
    },
    {
        name: "Flitterkatzen",
        id: {
            male: 726,
            female: 726
        }
    },
    {
        name: "Venompaw",
        id: {
            male: 727,
            female: 727
        }
    },
    {
        name: "Batcat",
        id: {
            male: 728,
            female: 728
        }
    },
    {
        name: "Sea Devil",
        id: {
            male: 734,
            female: 734
        }
    },
    {
        name: "Coralripper",
        id: {
            male: 735,
            female: 735
        }
    },
    {
        name: "Plumfish",
        id: {
            male: 736,
            female: 736
        }
    },
    {
        name: "Gorongra",
        id: {
            male: 738,
            female: 738
        }
    },
    {
        name: "Noctungra",
        id: {
            male: 739,
            female: 739
        }
    },
    {
        name: "Silverneck",
        id: {
            male: 740,
            female: 740
        }
    },
    {
        name: "Slagsnare",
        id: {
            male: 761,
            female: 761
        }
    },
    {
        name: "Nightstinger",
        id: {
            male: 762,
            female: 762
        }
    },
    {
        name: "Razorcreep",
        id: {
            male: 763,
            female: 763
        }
    },
    {
        name: "Nightdweller",
        id: {
            male: 849,
            female: 849
        }
    },
    {
        name: "Frostflare",
        id: {
            male: 850,
            female: 850
        }
    },
    {
        name: "Cinderhoof",
        id: {
            male: 851,
            female: 851
        }
    },
    {
        name: "Mouldpincer",
        id: {
            male: 868,
            female: 868
        }
    },
    {
        name: "Bloodcurl",
        id: {
            male: 869,
            female: 869
        }
    },
    {
        name: "Leafscuttler",
        id: {
            male: 870,
            female: 870
        }
    },
    {
        name: "Swamp Snapper",
        id: {
            male: 886,
            female: 886
        }
    },
    {
        name: "Mould Shell",
        id: {
            male: 887,
            female: 887
        }
    },
    {
        name: "Reed Lurker",
        id: {
            male: 888,
            female: 888
        }
    },
    {
        name: "Ivory Fang",
        id: {
            male: 901,
            female: 901
        }
    },
    {
        name: "Shadow Claw",
        id: {
            male: 902,
            female: 902
        }
    },
    {
        name: "Snow Pelt",
        id: {
            male: 903,
            female: 903
        }
    },
    {
        name: "Jackalope",
        id: {
            male: 905,
            female: 905
        }
    },
    {
        name: "Wolpertinger",
        id: {
            male: 906,
            female: 906
        }
    },
    {
        name: "Dreadhare",
        id: {
            male: 907,
            female: 907
        }
    },
    {
        name: "Gold Sphinx",
        id: {
            male: 950,
            female: 950
        }
    },
    {
        name: "Emerald Sphinx",
        id: {
            male: 951,
            female: 951
        }
    },
    {
        name: "Shadow Sphinx",
        id: {
            male: 952,
            female: 952
        }
    },
    {
        name: "Jungle Saurian",
        id: {
            male: 959,
            female: 959
        }
    },
    {
        name: "Ember Saurian",
        id: {
            male: 960,
            female: 960
        }
    },
    {
        name: "Lagoon Saurian",
        id: {
            male: 961,
            female: 961
        }
    },
    {
        name: "Blazing Unicorn",
        id: {
            male: 1017,
            female: 1017
        }
    },
    {
        name: "Arctic Unicorn",
        id: {
            male: 1018,
            female: 1018
        }
    },
    {
        name: "Prismatic Unicorn",
        id: {
            male: 1019,
            female: 1019
        }
    },
    {
        name: "Cranium Spider",
        id: {
            male: 1025,
            female: 1025
        }
    },
    {
        name: "Cave Tarantula",
        id: {
            male: 1026,
            female: 1026
        }
    },
    {
        name: "Gloom Widow",
        id: {
            male: 1027,
            female: 1027
        }
    },
    {
        name: "Marsh Toad",
        id: {
            male: 1052,
            female: 1052
        }
    },
    {
        name: "Sanguine Frog",
        id: {
            male: 1053,
            female: 1053
        }
    },
    {
        name: "Toxic Toad",
        id: {
            male: 1054,
            female: 1054
        }
    },
    {
        name: "Ebony Tiger",
        id: {
            male: 1091,
            female: 1091
        }
    },
    {
        name: "Feral Tiger",
        id: {
            male: 1092,
            female: 1092
        }
    },
    {
        name: "Jungle Tiger",
        id: {
            male: 1093,
            female: 1093
        }
    },
    {
        name: "Tawny Owl",
        id: {
            male: 1104,
            female: 1104
        }
    },
    {
        name: "Snowy Owl",
        id: {
            male: 1105,
            female: 1105
        }
    },
    {
        name: "Boreal Owl",
        id: {
            male: 1106,
            female: 1106
        }
    },
    {
        name: "Festive Snowman",
        id: {
            male: 1167,
            female: 1167
        }
    },
    {
        name: "Muffled Snowman",
        id: {
            male: 1168,
            female: 1168
        }
    },
    {
        name: "Caped Snowman",
        id: {
            male: 1169,
            female: 1169
        }
    },
    {
        name: "Rabbit Rickshaw",
        id: {
            male: 1179,
            female: 1179
        }
    },
    {
        name: "Bunny Dray",
        id: {
            male: 1180,
            female: 1180
        }
    },
    {
        name: "Cony Cart",
        id: {
            male: 1181,
            female: 1181
        }
    },
    {
        name: "River Crocovile",
        id: {
            male: 1183,
            female: 1183
        }
    },
    {
        name: "Swamp Crocovile",
        id: {
            male: 1184,
            female: 1184
        }
    },
    {
        name: "Nightmarish Crocovile",
        id: {
            male: 1185,
            female: 1185
        }
    },
    {
        name: "Jousting Eagle",
        id: {
            male: 1208,
            female: 1208
        }
    },
    {
        name: "Cerberus Champion",
        id: {
            male: 1209,
            female: 1209
        }
    },
    {
        name: "Battle Badger",
        id: {
            male: 1247,
            female: 1247
        }
    },
    {
        name: "Ether Badger",
        id: {
            male: 1248,
            female: 1248
        }
    },
    {
        name: "Zaoan Badger",
        id: {
            male: 1249,
            female: 1249
        }
    },
    {
        name: "Floating Sage",
        id: {
            male: 1264,
            female: 1264
        }
    },
    {
        name: "Floating Scholar",
        id: {
            male: 1265,
            female: 1265
        }
    },
    {
        name: "Floating Augur",
        id: {
            male: 1266,
            female: 1266
        }
    },
    {
        name: "Snow Strider",
        id: {
            male: 1284,
            female: 1284
        }
    },
    {
        name: "Dusk Pryer",
        id: {
            male: 1285,
            female: 1285
        }
    },
    {
        name: "Dawn Strayer",
        id: {
            male: 1286,
            female: 1286
        }
    },
    {
        name: "Benevolent Savanna Ostrich",
        id: {
            male: 1309,
            female: 1309
        }
    },
    {
        name: "Benevolent Coral Rhea",
        id: {
            male: 1310,
            female: 1310
        }
    },
    {
        name: "Benevolent Eventide Nandu",
        id: {
            male: 1311,
            female: 1311
        }
    },
    {
        name: "Savanna Ostrich",
        id: {
            male: 1324,
            female: 1324
        }
    },
    {
        name: "Coral Rhea",
        id: {
            male: 1325,
            female: 1325
        }
    },
    {
        name: "Eventide Nandu",
        id: {
            male: 1326,
            female: 1326
        }
    },
    {
        name: "Voracious Hyaena",
        id: {
            male: 1333,
            female: 1333
        }
    },
    {
        name: "Cunning Hyaena",
        id: {
            male: 1334,
            female: 1334
        }
    },
    {
        name: "Scruffy Hyaena",
        id: {
            male: 1335,
            female: 1335
        }
    },
    {
        name: "Merry Mammoth",
        id: {
            male: 1379,
            female: 1379
        }
    },
    {
        name: "Holiday Mammoth",
        id: {
            male: 1380,
            female: 1380
        }
    },
    {
        name: "Festive Mammoth",
        id: {
            male: 1381,
            female: 1381
        }
    },
    {
        name: "Void Watcher",
        id: {
            male: 1389,
            female: 1389
        }
    },
    {
        name: "Rune Watcher",
        id: {
            male: 1390,
            female: 1390
        }
    },
    {
        name: "Rift Watcher",
        id: {
            male: 1391,
            female: 1391
        }
    },
    {
        name: "Hyacinth",
        id: {
            male: 1439,
            female: 1439
        }
    },
    {
        name: "Peony",
        id: {
            male: 1440,
            female: 1440
        }
    },
    {
        name: "Dandelion",
        id: {
            male: 1441,
            female: 1441
        }
    },
    {
        name: "Rustwurm",
        id: {
            male: 1446,
            female: 1446
        }
    },
    {
        name: "Bogwurm",
        id: {
            male: 1447,
            female: 1447
        }
    },
    {
        name: "Gloomwurm",
        id: {
            male: 1448,
            female: 1448
        }
    }
]

export const dictionary = dictionaryFactory(tokens)
