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
};

export const CityCard = ({ name, description, pois }: CityCardProps) => {
	return (
		<div className="mt-30">
			<div className={`container p-20`}>
				<div className="mb-10">
					<strong>Nom :</strong> {name}
				</div>
				<div className="mb-10">
					<strong>Description :</strong> {description}
				</div>
				{!!pois?.length && (
					<div>
						<strong>Points of Interest:</strong>
						<ul>
							{pois.map((poi) => (
								<li key={poi.id}>
									<div className="mb-10">
										<strong>{poi.name}</strong>
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
