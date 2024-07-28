import { gql } from "@apollo/client";

export const GET_ALL_CITIES = gql`
	query GetAllCities {
		getAllCities {
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

export const GET_ALL_POIS = gql`
	query GetAllPois {
		getAllPois {
			id
			description
			address
			name
			latitude
			longitude
			postalCode
			averageNote
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
				averageNote
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
			latitude
			longitude
			postalCode
			averageNote
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

export const GET_ALL_RATINGS = gql`
query Query {
	getAllRatings {
	  id
	  user {
		id
		firstName
		lastName
	  }
	  rating
	  text
	}
  }
`;

export const CHECK_EMAIL_UNIQUE = gql`
	query IsEmailUnique($email: String!) {
		isEmailUnique(email: $email)
	}
`;

export const CHECK_CITY_UNIQUE = gql`
	query IsCityNameUnique($name: String!) {
		isCityNameUnique(name: $name)
	}
`;

export const GET_USER_BY_EMAIL = gql`
	query GetUserByEmail($email: String!) {
		getUserByEmail(email: $email) {
			id
			firstName
			lastName
			email
			role
			city {
				id
				name
			}
		}
	}
`;
export const GET_RATINGS_BY_POI = gql`
	query GetRatingsByPoi($poiId: Float!) {
		getRatingsByPoi(poiId: $poiId) {
			id
			rating
			text
			user {
				id
				firstName
				lastName
			}
		}
	}
`;
