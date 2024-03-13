export default function parseNum(str: string): number {
  let num: number;

  switch (str) {
    case "JACK":
    case "QUEEN":
    case "KING":
      num = 10;
      break;
    default:
      num = Number(str);
  }

  return num;
}
