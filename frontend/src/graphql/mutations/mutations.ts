import { gql } from "@apollo/client";

export const CREATE_NEW_POI = gql`
	mutation createNewPoi($poiData: PoiInput!) {
		createNewPoi(poiData: $poiData) {
			id
		}
	}
`;

export const EDIT_POI_BY_ID = gql`
	mutation UpdatePoiById($poiInput: PoiUpdateInput!, $updatePoiByIdId: Float!) {
		updatePoiById(PoiInput: $poiInput, id: $updatePoiByIdId)
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
		updateUserById(newUserInput: $newUserInput, id: $updateUserByIdId)
	}
`;
