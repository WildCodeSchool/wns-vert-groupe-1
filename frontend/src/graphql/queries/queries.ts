import { gql } from "@apollo/client";

export const GET_ALL_CITIES = gql`
	query GetAllCities($limit: Float, $offset: Float) {
		getAllCities(limit: $limit, offset: $offset) {
			name
			description
			id
			lat
			lon
			pois {
				id
				name
				address
				description
			}
		}
	}
`;

export const GET_ALL_CATEGORIES = gql`
	query GetAllCategories {
		getAllCategories {
			name
			id
		}
	}
`;

export const GET_CITY_BY_NAME = gql`
	query GetCityByName($name: String!) {
		getCityByName(name: $name) {
			name
			description
			pois {
				id
				name
				address
				description
				latitude
				longitude
				images
				category {
					id
					name
				}
			}
			lon
			lat
		}
	}
`;

export const GET_POI_BY_ID = gql`
	query GetPoiById($id: Float!) {
		getPoiById(id: $id) {
			description
			address
			name
			city {
				id
				name
			}
			category {
				id
				name
			}
			images
		}
	}
`;

export const LOGIN = gql`
	query Login($userData: UserLoginInput!) {
		login(userData: $userData)
	}
`;

export const CHECK_INFO = gql`
	query CheckSession {
		checkSession {
			email
			isLoggedIn
			role
		}
	}
`;

export const GET_USER = gql`
	query GetUserById($id: Float!) {
		getUserById(id: $id) {
			id
			lastName
			firstName
			email
			role
			city {
				name
			}
		}
	}
`;

export const GET_CITY_BY_ID = gql`
	query GetCityById($id: Float!) {
		getCityById(id: $id) {
			id
			name
			description
			lat
			lon
			pois {
				id
				name
				category {
					id
					name
				}
				address
				description
				latitude
				longitude
				postalCode
				ratings {
					id
					rating
					text
				}
			}
		}
	}
`;

export const GET_REVIEWS_FOR_USER = gql`
	query GetReviewsForUser($userId: Int!) {
		reviewsForUser(userId: $userId) {
			id
			rating
			comment
			user {
				firstname
				lastname
				id
				email
			}
		}
	}
`;
