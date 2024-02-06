import CityCard, { CityCardProps } from "./CityCard";

type DisplayCitiesType = {
	cities: CityCardProps[];
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
						</div>
					))}
			</section>
		</>
	);
};

export default DisplayCities;
