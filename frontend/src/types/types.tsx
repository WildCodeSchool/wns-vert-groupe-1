export type POIType = {
	id: number;
	name: string;
	address: string;
	description: string;
};

export type CityType = {
	id?: number;
	name: string;
	description?: string;
	pois?: POIType[];
	lat?: number;
	lon?: number;
};

export type CityMapProps = {
	lat?: number;
	lon?: number;
};

export type DisplayCitiesType = {
	cities: (CityType & CityMapProps)[];
	onClickDelete?: (adId: number) => void;
	onClickEdit?: (adId: number) => void;
};

export type POIInput = {
	name: string;
	address: string;
	description: string;
	city: string;
	category: string;
	images: string[];
};
