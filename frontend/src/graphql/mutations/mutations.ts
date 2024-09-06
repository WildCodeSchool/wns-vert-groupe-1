import { gql } from "@apollo/client";

export const CREATE_NEW_POI = gql`
	mutation createNewPoi($poiData: PoiInput!) {
		createNewPoi(poiData: $poiData) {
			id
		}
	}
`;

export const EDIT_POI_BY_ID = gql`
	mutation UpdatePoiById(
		$newPoiInput: PoiUpdateInput!
		$updatePoiByIdId: Float!
	) {
		updatePoiById(newPoiInput: $newPoiInput, id: $updatePoiByIdId)
	}
`;

export const DELETE_POI_BY_ID = gql`
	mutation DeletePoiById($id: Float!) {
		deletePoiById(id: $id)
	}
`;

export const REGISTER = gql`
	mutation Register($newUserData: UserInput!) {
		register(newUserData: $newUserData)
	}
`;

export const CREATE_NEW_CITY = gql`
	mutation CreateNewCity($cityData: CityInput!) {
		createNewCity(cityData: $cityData) {
			id
			name
		}
	}
`;

export const DELETE_CITY_BY_ID = gql`
	mutation DeleteCityById($deleteCityByIdId: Float!) {
		deleteCityById(id: $deleteCityByIdId)
	}
`;

export const EDIT_CITY_BY_ID = gql`
	mutation UpdateCity($cityData: CityUpdateInput!, $updateCityId: Float!) {
		updateCity(cityData: $cityData, id: $updateCityId) {
			id
			name
			lon
			lat
			description
		}
	}
`;

export const UPDATE_USER_BY_ID = gql`
	mutation UpdateUserById(
		$newUserInput: UserUpdateInput!
		$updateUserByIdId: Float!
	) {
		updateUserById(newUserInput: $newUserInput, id: $updateUserByIdId) {
			id
			firstName
			email
			city {
				id
				name
			}
			lastName
			role
		}
	}
`;

export const DELETE_USER_BY_ID = gql`
	mutation DeleteUserById($deleteUserByIdId: Float!) {
		deleteUserById(id: $deleteUserByIdId)
	}
`;

export const UPDATE_USER_ROLE_BY_ID = gql`
	mutation UpdateUserById(
		$newUserInput: UserUpdateInput!
		$updateUserByIdId: Float!
	) {
		updateUserById(newUserInput: $newUserInput, id: $updateUserByIdId) {
			id
			firstName
			lastName
			email
			role
		}
	}
`;

export const DELETE_CATEGORY_BY_ID = gql`
	mutation DeleteCategoryById($deleteCategoryByIdId: Float!) {
		deleteCategoryById(id: $deleteCategoryByIdId)
	}
`;

export const CREATE_NEW_CATEGORY = gql`
	mutation CreateNewCategory($categoryData: CategoryInput!) {
		createNewCategory(categoryData: $categoryData) {
			id
			name
		}
	}
`;

export const EDIT_CATEGORY_BY_ID = gql`
	mutation UpdateCategoryById(
		$updateCategoryByIdId: Float!
		$categoryData: CategoryInput!
	) {
		updateCategoryById(id: $updateCategoryByIdId, categoryData: $categoryData)
	}
`;

export const GET_CATEGORY_BY_ID = gql`
	query GetCategoryById($getCategoryByIdId: Float!) {
		getCategoryById(id: $getCategoryByIdId) {
			id
			name
		}
	}
`;
