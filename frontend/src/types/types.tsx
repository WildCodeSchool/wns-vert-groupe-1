export type POIType = {
	id: number;
	name: string;
	address: string;
	description: string;
};

export type CityCardProps = {
	id?: number;
	name: string;
	description: string;
	pois?: POIType[];
};

export type CityMapProps = {
	id?: number;
	lat: number;
	lon: number;
};

export type DisplayCitiesType = {
	cities: (CityCardProps & CityMapProps)[];
	onClickDelete?: (adId: number) => void;
	onClickEdit?: (adId: number) => void;
};

export type POIInput = {
	name: string;
	address: string;
	description: string;
	city: string;
	category: string;
};