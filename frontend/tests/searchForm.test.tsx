import { SearchForm } from "@components";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextRouter } from "next/router";
import { TextEncoder, TextDecoder } from "util";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

Object.assign(global, { TextDecoder, TextEncoder });

const mockRouter: Partial<NextRouter> = {
	push: jest.fn(),
};

// mocks next router
jest.mock("next/router", () => ({
	__esModule: true,
	useRouter: () => mockRouter,
}));

// mocks react toastify
jest.mock("react-toastify", () => ({
	toast: {
		error: jest.fn(),
	},
}));

describe("SearchForm", () => {
	it("renders component, checks form presence, submits empty form, checks error toast", () => {
		render(<SearchForm />);

		const form = screen.getByTestId("search-form-container");
		expect(form).toBeInTheDocument();

		const button = screen.getByRole("button");

		const cityInput = screen.getByPlaceholderText("Cherchez une ville");
		expect(cityInput).toBeInTheDocument();
		expect(cityInput).toHaveValue("");

		fireEvent.change(cityInput, { target: { value: "" } });

		fireEvent.click(button);

		expect(toast.error).toHaveBeenCalledWith(
			"Veuillez saisir un nom de ville."
		);

	});
	it("renders component, checks form presence, submits form filled with correct value, checks redirection", () => {
		render(<SearchForm />);

		const form = screen.getByTestId("search-form-container");
		expect(form).toBeInTheDocument();

		const button = screen.getByRole("button");

		const cityInput = screen.getByPlaceholderText("Cherchez une ville");
		expect(cityInput).toBeInTheDocument();
		expect(cityInput).toHaveValue("");

		fireEvent.change(cityInput, { target: { value: "Paris" } });

		fireEvent.click(button);

		expect(mockRouter.push).toHaveBeenCalledWith("/city/search/Paris");
	});
});
