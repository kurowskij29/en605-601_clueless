class Card {
    constructor(type, name, imageURL) {
        this.type = type;
        this.name = name;
        this.imageURL = imageURL;
    }

}

// six characters
const character_cards = [
    new Card('character', 'Jim', 'images/card_jim.png'),
    new Card('character', 'Pam', 'images/card_pam.png'),
    new Card('character', 'Dwight', 'images/card_dwight.png'),
    new Card('character', 'Angela', 'images/card_angela.png'),
    new Card('character', 'Michael', 'images/card_michael.png'),
    new Card('character', 'Andy', 'images/card_andy.png')
  ];

  // six weapons
const weapon_cards = [
    new Card('weapon', 'Dundie Trophy', 'images/card_trophy.png'),
    new Card('weapon', 'Poisoned Pretzel', 'images/card_pretzel.png'),
    new Card('weapon', 'Coffee Mug', 'images/card_mug.png'),
    new Card('weapon', 'Bacon Grill', 'images/card_grill.png'),
    new Card('weapon', 'Dunder Mifflin Paper', 'images/card_paper.png'),
    new Card('weapon', 'Rabid Bat', 'images/card_bat.png')
]

// nine rooms
const room_cards = [
    new Card('room', 'Reception', 'images/card_reception.png'),
    new Card('room', 'Conference Room', 'images/card_conference.png'),
    new Card('room', 'Break Room', 'images/card_break.png'),
    new Card('room', 'Annex', 'images/card_annex.png'),
    new Card('room', 'Accounting', 'images/card_accounting.png'),
    new Card('room', 'Parking lot', 'images/card_parking.png'),
    new Card('room', 'Warehouse', 'images/card_warehouse.png'),
    new Card('room', 'Kitchen', 'images/card_kitchen.png'),
    new Card('room', 'Michaels Office', 'images/card_office.png'),
]

function selectRandomCard(cardsArray) {
    const randomIndex = Math.floor(Math.random() * cardsArray.length);
    return cardsArray.splice(randomIndex, 1)[0]; // Removes and returns the selected card
}

let winningHand = [];
let shuffledDeck = [];

/*Select one card from each type pile*/
function WinningHand () {
    winningHand = [
        selectRandomCard([...character_cards]),
        selectRandomCard([...weapon_cards]),
        selectRandomCard([...room_cards]),
    ];
}

/*Put all remaining cards together and randomize them*/
function ShuffleDeck () {
    const deck = [...character_cards, ...weapon_cards, ...room_cards];
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    shuffledDeck = deck;
}

/*Randomly assign X cards to each player*/
function DealCards (numberOfPlayers) {
    const playerHands = Array.from({ length: numberOfPlayers }, () => []);
    let cardIndex = 0;
    while (cardIndex < shuffledDeck.length) {
        for (let i = 0; i < numberOfPlayers; i++) {
            if (cardIndex < shuffledDeck.length) {
                playerHands[i].push(shuffledDeck[cardIndex++]);
            } else {
                break;
            }
        }
    }
    console.log("hand: " + playerHands)
    return playerHands; // Returns an array of arrays, each containing the cards for one player
}

/*After end game, call winningHand, shuffleDeck, and dealCards*/
function ResetDeck () {
    WinningHand();
    ShuffleDeck();
}


module.exports = {
    Card,
    character_cards,
    weapon_cards,
    room_cards,
    selectRandomCard,
    WinningHand,
    ShuffleDeck,
    DealCards,
    ResetDeck,
};
