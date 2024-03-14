import { gql } from "@apollo/client";

export const CREATE_NEW_POI = gql`
	mutation createNewPoi($poiData: PoiInput!) {
		createNewPoi(poiData: $poiData) {
			id
		}
	}
`;

export const REGISTER = gql`
	mutation Register($newUserData: UserInput!) {
		register(newUserData: $newUserData)
	}
`;
