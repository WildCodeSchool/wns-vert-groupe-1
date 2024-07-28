import { gql } from "@apollo/client";

export const CREATE_NEW_POI = gql`
	mutation createNewPoi($poiData: PoiInput!) {
		createNewPoi(poiData: $poiData) {
			id
		}
	}
`;

export const EDIT_POI_BY_ID = gql`
	mutation UpdatePoi($newPoiInput: PoiInput!, $id: Float!) {
		updatePoiById(newPoiInput: $newPoiInput, id: $id)
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

export const CREATE_REVIEW_MUTATION = gql`
	mutation Mutation($ratingData: RatingInput!) {
		createRating(ratingData: $ratingData) {
			id
			text
			rating
			poi {
				name
				id
			}
			user {
				firstName
				lastName
				id
			}
		}
	}
`;
