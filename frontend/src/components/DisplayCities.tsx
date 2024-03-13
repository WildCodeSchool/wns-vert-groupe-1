import { CityCard } from "./CityCard";
import { CityType } from "@types";

type DisplayCitiesType = {
	cities: CityType[];
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
						</div>
					))}
			</section>
		</>
	);
};
