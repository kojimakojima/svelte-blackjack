type DeckType = {
	deck_id: string,
	remaining: number,
	shuffled: boolean,
	success: boolean,
	cards: Array<CardType>
}

type CardType = {
	code: string,
  image: string,
  images: {
		png: string,
		svg: string
  },
  suit: string,
  value: string
}