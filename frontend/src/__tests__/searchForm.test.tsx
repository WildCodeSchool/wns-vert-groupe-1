import SearchForm from "../components/SearchForm";
import "@testing-library/jest-dom";
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from "@testing-library/react";
import { NextRouter } from "next/router";
import { TextEncoder, TextDecoder } from "util";

Object.assign(global, { TextDecoder, TextEncoder });

const mockRouter: Partial<NextRouter> = {
	push: jest.fn(),
};

// Mock the useRouter hook
jest.mock("next/router", () => ({
	__esModule: true,
	useRouter: () => mockRouter,
}));

describe("SearchForm", () => {
	it("renders the search form component, checks the form to be present, checks input to be empty, then clicks the submit button and checks it to has an error message", () => {
		render(<SearchForm />);

		const form = screen.getByRole("searchbox");
		expect(form).toBeInTheDocument();

		const button = screen.getByRole("button");
		const input = screen.getByPlaceholderText("Saisir une ville");

		fireEvent.change(input, { target: { value: "" } });

		fireEvent.click(button);

		expect(input.getAttribute("placeholder")).toBe(
			"Veuillez d'abord saisir une ville s'il vous plait"
		);
	});
	it("renders the search form component, checks the form to be present, checks the input to has value, then clicks the submit button and checks the redirection to the new page", () => {
		render(<SearchForm />);

		const form = screen.getByRole("searchbox");
		expect(form).toBeInTheDocument();

		const button = screen.getByRole("button");
		const input = screen.getByPlaceholderText("Saisir une ville");

		fireEvent.change(input, { target: { value: "Paris" } });

		fireEvent.click(button);

		expect(mockRouter.push).toHaveBeenCalledWith("/city/search/Paris");
	});
});
