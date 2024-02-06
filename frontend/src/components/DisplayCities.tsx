import CityCard, { CityCardProps } from "./CityCard";
import CityMap, { CityMapProps } from "./CityMap"

type DisplayCitiesType = {
	cities: (CityCardProps & CityMapProps)[];
	title: string;
	onClickDelete?: (adId: number) => void;
	onClickEdit?: (adId: number) => void;
};

const DisplayCities = ({ cities }: DisplayCitiesType) => {
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
				
							<CityMap
							lat={city.lat}
							lon={city.lon}
							/>
						</div>
					))}
			</section>
		</>
	);
};

export default DisplayCities;
