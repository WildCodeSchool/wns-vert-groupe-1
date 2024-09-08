export type PoiType = {
	id: number;
	name: string;
	address?: string;
	description: string;
	postalCode?: string;
	latitude?: number;
	longitude?: number;
	images: string[];
	city?: CityType;
	category: CategoryType;
	ratings?: RatingType[];
};

export type CityType = {
	id?: number;
	name?: string;
	description?: string;
	pois?: PoiType[];
	lat?: number;
	lon?: number;
};

export type CityInput = {
	id?: number;
	name: string;
	description: string;
	lat?: number;
	lon?: number;
};

export type CategoryInput = {
	name: string;
};

export type RatingType = {
	id: number;
	rating: number;
	text: string;
};

export type CategoryType = {
	id?: number;
	name: string;
};

export type CityMapProps = {
	lat?: number;
	lon?: number;
	pois?: {
		id: number;
		name: string;
		address: string;
		description: string;
		latitude: number;
		longitude: number;
	}[];
};

export type POIInput = {
	id?: number;
	name: string;
	address: string;
	description: string;
	city: number | string;
	category: number | string;
	images: string[];
	postalCode: string;
	latitude?: number;
	longitude?: number;
};

export type POI = {
	name: string;
	address: string;
	description: string;
	city: string;
	category: string;
	images: string[];
};

export type UserInput = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	city: number;
};

export type UserType = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	city: CityType;
	role: UserRoleType;
};

export type LoginT = {
	email: string;
	password: string;
	checked: boolean;
};

export type UserRoleType = "ADMIN" | "CITYADMIN" | "SUPERUSER" | "USER";
