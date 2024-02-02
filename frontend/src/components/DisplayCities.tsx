import CityCard, { CityCardProps } from "./CityCard";

type DisplayCitiesType = {
	cities: CityCardProps[];
	title: string;
	onClickDelete?: (adId: number) => void;
	onClickEdit?: (adId: number) => void;
};

const DisplayCities = ({ cities, title }: DisplayCitiesType) => {
	return (
		<>
			<h2>{title}</h2>
			<section className="recent-cities">
				{!!cities &&
					cities.map((city) => (
						<div key={city.id}>
							<CityCard
								id={city.id}
								name={city.name}
								description={city.description}
							/>
						</div>
					))}
			</section>
		</>
	);
};

export default DisplayCities;
