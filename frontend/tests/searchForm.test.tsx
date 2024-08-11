import { SearchForm } from "@components";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextRouter } from "next/router";
import { TextEncoder, TextDecoder } from "util";
import { toast } from "react-toastify";

Object.assign(global, { TextDecoder, TextEncoder });

const mockRouter: Partial<NextRouter> = {
	push: jest.fn(),
};
//Mock the react-toastify library
jest.mock("react-toastify", () => ({
	toast: {
		success: jest.fn(),
		error: jest.fn(),
	},
}));
// Mock the useRouter hook
jest.mock("next/router", () => ({
	__esModule: true,
	useRouter: () => mockRouter,
}));

describe("SearchForm", () => {
	it("renders the search form component, checks the form to be present, checks input to be empty, then clicks the submit button and checks it to has an error message", () => {
		render(<SearchForm />);

		const form = screen.getByTestId("search-form-container");
		expect(form).toBeInTheDocument();

		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();

		const cityInput = screen.getByPlaceholderText("Cherchez une ville");
		expect(cityInput).toBeInTheDocument();
		expect(cityInput).toHaveValue("");

		fireEvent.click(button);
		expect(toast.error).toHaveBeenCalled();
	});
	it("renders the search form component, checks the form to be present, checks the input to has value, then clicks the submit button and checks the redirection to the new page", () => {
		render(<SearchForm />);

		const form = screen.getByTestId("search-form-container");
		expect(form).toBeInTheDocument();

		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();

		const cityInput = screen.getByPlaceholderText("Cherchez une ville");
		expect(cityInput).toBeInTheDocument();
		expect(cityInput).toHaveValue("");

		fireEvent.change(cityInput, { target: { value: "Paris" } });
		expect(cityInput).toHaveValue("Paris");

		fireEvent.click(button);

		expect(mockRouter.push).toHaveBeenCalledWith("/city/search/Paris");
	});
});
