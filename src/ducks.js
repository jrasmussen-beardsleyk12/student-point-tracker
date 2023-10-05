// Relates to all handling of the ducks

const allDuckColorOpts = {
  "0": "Black",
  "1": "White",
  "2": "Brown",
  "3": "Yellow",
  "4": "Blue",
  "5": "Red",
  "6": "Rainbow"
};

const allDuckOpts = {
  hat: {
    item_name: "hat",
    index: 1,
    length: 2,
    itemCodes: {
      "00": "None",
      "01": "Baseball Hat - Blue",
      "02": "Trilby Hat",
      "03": "Pirate Captian Hat",
      "04": "Mohawk - Blue",
      "05": "Mohawk - Red",
      "06": "Bald Spot",
      "07": "Receeding Hairline",
      "08": "Top Hat",
      "09": "Baseball Hat - Red",
      "0a": "Party Hat - Blue",
      "0b": "Party Hat - Red"
    }
  },
  eyes: {
    item_name: "eyes",
    index: 3, length: 2,
    itemCodes: {
      "00": "Default",
      "01": "Sun Glasses",
      "02": "Surprised",
      "03": "Angry"
    }
  },
  beak: {
    item_name: "beak",
    index: 5, length: 2,
    itemCodes: {
      "00": "Default"
    }
  },
  wings: {
    item_name: "wings",
    index: 7, length: 2,
    itemCodes: {
      "00": "Default"
    }
  },
  accessories: {
    // Within Fairfield Programming they call this 'smoke', changed to accessories
    item_name: "accessories",
    index: 9, length: 2,
    itemCodes: {
      "00": "None",
      "05": "Drink",
      "06": "Hearts - Red",
      "07": "Hearts - Blue"
    }
  },
  body: {
    // Sometimes called 'tail' in Fairfield Programming
    item_name: "body",
    index: 11, length: 2,
    itemCodes: {
      "00": "Default"
    }
  },
  item: {
    item_name: "item",
    index: 13, length: 2,
    itemCodes: {
      "00": "None",
      "01": "Newspaper",
      "02": "Paintbrush - Blue",
      "03": "Paintbrush - Red"
    }
  },
  beakColor: {
    item_name: "beak-color",
    index: 15, length: 1,
    itemCodes: allDuckColorOpts
  },
  bodyColor: {
    item_name: "body-color",
    index: 16, length: 1,
    itemCodes: allDuckColorOpts
  }
};

const allDuckKinds = [
  "hat", "eyes", "beak", "wings", "accessories", "body", "item", "beakColor", "bodyColor"
];

function generateDuckOpts(unlockObj, duckString) {

  let optsObj = [];

  for (const kind of allDuckKinds) {

    let objToAdd = {
      item_name: allDuckOpts[kind].item_name,
      index: allDuckOpts[kind].index,
      length: allDuckOpts[kind].length,
      items: []
    };

    for (const unlocked of unlockObj[kind]) {
      // Check if it is currently in use

      let currentItemCode = duckString.slice(allDuckOpts[kind].index, parseInt(allDuckOpts[kind].index) + (parseInt(allDuckOpts[kind].length)));

      if (currentItemCode.toString() === unlocked.toString()) {
        objToAdd.items.push({
          code: unlocked,
          name: allDuckOpts[kind].itemCodes[unlocked],
          active: true
        });
      } else {
        objToAdd.items.push({
          code: unlocked,
          name: allDuckOpts[kind].itemCodes[unlocked]
        });
      }
    }

    optsObj.push(objToAdd);
  }

  return optsObj;
}

function parseDuckUnlockString(duckString) {
  // To track what features of a duck has been unlocked per user,
  // We will use a 'duckUnlockString' to store this data.
  // Where the string looks like so: ITEM_KIND:code,code;ITEM_KIND:code,code;
  // That is an item kind with a colon denoting each item of that kind that's
  // been unlocked, followed by a semicolon to break between kinds, and commas
  // to break between items of each kind.
  // Just like the actual duckgen library, codes will be stored as two digit
  // hexadecimal.

  let unlockObj = {
    hat: [],
    eyes: [],
    beak: [],
    wings: [],
    accessories: [],
    body: [],
    item: [],
    beakColor: [],
    bodyColor: []
  };

  const unlockSingleDigitCodes = [ "beakColor", "bodyColor" ];

  let unlockedKinds = duckString.split(";");

  for (const kind of unlockedKinds) {

    if (typeof kind !== "string" || kind.length == 0) {
      continue;
    }

    let keyPair = kind.split(":");

    let unlockedKindName = keyPair[0];
    let unlockedItems = keyPair[1].split(",");

    for (const item of unlockedItems) {
      // Convert from hex
      let itemCode = parseInt(item, 16);

      if (itemCode.toString().length < 2 && !unlockSingleDigitCodes.includes(unlockedKindName)) {
       itemCode = `0${itemCode.toString()}`;
      }

      unlockObj[unlockedKindName].push(itemCode);
    }
  }

  return unlockObj;
}

module.exports = {
  generateDuckOpts,
  parseDuckUnlockString
};
