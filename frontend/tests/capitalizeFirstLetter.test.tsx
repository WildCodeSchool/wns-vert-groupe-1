import { capitalizeFirstLetter } from "../src/utils";

describe("capitalizeFirstLetter utils", () => {
	test("capitalize the first letter of a word", () => {
		expect(capitalizeFirstLetter("test")).toBe("Test");
	});

	test("capitalize the first letter and makes other letters lowercase", () => {
		expect(capitalizeFirstLetter("tEST")).toBe("Test");
	});

	test("When string is empty, trigger a new error", () => {
		expect(() => {
			capitalizeFirstLetter("");
		}).toThrow();
	});

	test("process strings with leading spaces", () => {
		expect(capitalizeFirstLetter("   hello")).toBe("Hello");
	});

	test("process strings with only one character", () => {
		expect(capitalizeFirstLetter("t")).toBe("T");
	});

	test("keep non-alphabetic characters unchanged at the start", () => {
		expect(capitalizeFirstLetter("123test")).toBe("123test");
	});
});
