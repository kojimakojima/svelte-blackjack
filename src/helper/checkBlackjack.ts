export default function checkBlackjack(cards: Array<CardType>): boolean {
  let ace = 0;
  let face = 0;

  for (const e of cards) {
    switch (e.value) {
      case "ACE":
        ace++;
        break;
      case "10":
      case "JACK":
      case "QUEEN":
      case "KING":
        face++;
      default:
        break;
    }
  }
  if (cards.length === 2 && ace === 1 && face === 1) return true;
  else return false;
}
