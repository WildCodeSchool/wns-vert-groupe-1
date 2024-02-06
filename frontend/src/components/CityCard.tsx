export type PoiType = {
	id: number;
	name: string;
	address: string;
	description: string;
};

export type CityCardProps = {
	id?: number;
	name: string;
	description: string;
	pois?: PoiType[];
	lat?: number;
	lon?: number;
};

const CityCard = ({ name, description, pois }: CityCardProps) => {
	return (
		<div className={`mt-30 mb-30`}>
			<div className={`container p-20`}>
				<div className="mb-10">
					<strong className="primary">Nom :</strong> {name}
				</div>
				<div className="mb-10">
					<strong className="primary">Description :</strong> {description}
				</div>
				{!!pois?.length && (
					<div>
						<strong className="primary">Points d&apos;Interets:</strong>
						<ul>
							{pois.map((poi) => (
								<li key={poi.id}>
									<div className="mb-10">
										<strong className="primary">{poi.name}</strong>
										<div className="mt-10">{poi.description}</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default CityCard;
