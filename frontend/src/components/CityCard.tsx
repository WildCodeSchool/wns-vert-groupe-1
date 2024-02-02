export type CityCardProps = {
	id?: number;
	name: string;
	description: string;
};

const CityCard = ({ name, description }: CityCardProps) => {
	return (
		<div className="mt-30">
			<div className="container">
				<div>{name}</div>
				<div>{description}</div>
			</div>
		</div>
	);
};

export default CityCard;
