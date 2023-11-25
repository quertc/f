export default function formatNumberWithComma(number: number): string {
  return new Intl.NumberFormat('en-US').format(number);
}
