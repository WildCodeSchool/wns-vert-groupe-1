import { CityCard } from "./CityCard";
import { CityMap } from "./CityMap";
import { CityCardProps, CityMapProps } from "@types";

type DisplayCitiesType = {
	cities: (CityCardProps & CityMapProps)[];
	onClickDelete?: (adId: number) => void;
	onClickEdit?: (adId: number) => void;
};

export const DisplayCities = ({ cities }: DisplayCitiesType) => {
	return (
		<>
			<section className="recent-cities">
				{!!cities &&
					cities.map((city) => (
						<div key={city.id}>
							<CityCard
								id={city.id}
								name={city.name}
								description={city.description}
								pois={city.pois}
							/>

							<CityMap lat={city.lat} lon={city.lon} />
						</div>
					))}
			</section>
		</>
	);
};
