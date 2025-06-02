import { parseCoordinates } from "../utils";

const dataSet = [
  {
    str: "51.50851, -0.12572",
    expected: { latitude: 51.50851, longitude: -0.12572 },
  },
  {
    str: "51.50851,-0.12572",
    expected: { latitude: 51.50851, longitude: -0.12572 },
  },
  {
    str: "[51.50851, -0.12572]",
    expected: { latitude: 51.50851, longitude: -0.12572 },
  },
];

const badDataSet = [
  {
    str: "51.50851",
    expected: "Некорректный формат координат",
  },
  {
    str: "100,-190",
    expected: "Широта должна быть между -90 и 90",
  },
  {
    str: "80, -190",
    expected: "Долгота должна быть между -180 и 180",
  },
  {
    str: "jjjj,ccccc",
    expected: "Координаты должны быть числами",
  },
];

test.each(dataSet)("testing coordinates($str)", ({ str, expected }) => {
  expect(parseCoordinates(str)).toEqual(expected);
});

test.each(badDataSet)(
  "testing invalid coordinates($str)",
  ({ str, expected }) => {
    expect(() => parseCoordinates(str)).toThrow(expected);
  },
);
