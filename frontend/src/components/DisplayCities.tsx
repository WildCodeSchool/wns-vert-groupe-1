import { CityCard } from "@components";
import { DisplayCitiesType} from "@types";

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
