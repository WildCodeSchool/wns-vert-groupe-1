"use client";
import { Map, Marker } from "react-map-gl";
import { CityType } from "@types";
import { mainTheme } from "@theme";
import { SvgIconProps, useMediaQuery } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LocalHotelIcon from "@mui/icons-material/LocalHotel";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import AttractionsIcon from "@mui/icons-material/Attractions";
import MuseumIcon from "@mui/icons-material/Museum";
import RoomIcon from "@mui/icons-material/Room";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import ParkIcon from "@mui/icons-material/Park";
import { useState } from "react";

type CityMapProps = CityType & {
	activePoiId: number | null;
	onMarkerClick: (id: number) => void;
};

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
	width: 62,
	height: 34,
	padding: 7,
	"& .MuiSwitch-switchBase": {
		margin: 1,
		padding: 0,
		transform: "translateX(6px)",
		"&.Mui-checked": {
			color: "#fff",
			transform: "translateX(22px)",
			"& .MuiSwitch-thumb:before": {
				backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
					"#fff"
				)}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
			},
			"& + .MuiSwitch-track": {
				opacity: 1,
				backgroundColor: "#aab4be",
				...theme.applyStyles("dark", {
					backgroundColor: "#8796A5",
				}),
			},
		},
	},
	"& .MuiSwitch-thumb": {
		backgroundColor: mainTheme.palette.primary.main,
		width: 32,
		height: 32,
		"&::before": {
			content: "''",
			position: "absolute",
			width: "100%",
			height: "100%",
			left: 0,
			top: 0,
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center",
			backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
				"#fff"
			)}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
		},
		...theme.applyStyles("dark", {
			backgroundColor: "#003892",
		}),
	},
	"& .MuiSwitch-track": {
		opacity: 1,
		backgroundColor: "#aab4be",
		borderRadius: 20 / 2,
		...theme.applyStyles("dark", {
			backgroundColor: "#8796A5",
		}),
	},
}));

export const CityMap = ({
	lat,
	lon,
	pois,
	activePoiId,
	onMarkerClick,
}: CityMapProps) => {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
	const key = `${lat}-${lon}`;

	const handleMarkerClick = (poiId: number) => {
		onMarkerClick(poiId);
	};
	const isTabletOrMobile = useMediaQuery(mainTheme.breakpoints.down("lg"));

	const getIconByCategory = (
		category: string | undefined,
		isActive: boolean
	): React.ReactElement<SvgIconProps> => {
		const iconStyle = {
			fontSize: isActive ? 40 : 30,
			color: isActive
				? mainTheme.palette.primary.main
				: isDarkMode
					? mainTheme.palette.primary.light
					: mainTheme.palette.primary.dark,
		};

		switch (category) {
			case "restaurants":
				return <RestaurantIcon style={iconStyle} />;
			case "monuments":
				return <LocationCityIcon style={iconStyle} />;
			case "hotel":
				return <LocalHotelIcon style={iconStyle} />;
			case "cafes":
				return <LocalCafeIcon style={iconStyle} />;
			case "attractions":
				return <AttractionsIcon style={iconStyle} />;
			case "musées":
				return <MuseumIcon style={iconStyle} />;
			case "jardins":
				return <ParkIcon style={iconStyle} />;
			default:
				return <RoomIcon style={iconStyle} />;
		}
	};

	return (
		<Map
			key={key}
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
			initialViewState={{
				latitude: lat,
				longitude: lon,
				zoom: isTabletOrMobile ? 11 : 12,
			}}
			minZoom={10}
			scrollZoom={true}
			dragPan={true}
			dragRotate={true}
			doubleClickZoom={true}
			touchZoomRotate={false}
			mapStyle={
				isDarkMode
					? "mapbox://styles/mapbox/dark-v11"
					: "mapbox://styles/mapbox/streets-v12"
			}
		>
			<FormGroup>
				<FormControlLabel
					control={
						<MaterialUISwitch
							sx={{
								m: 3,
								position: "absolute",
								top: "10px",
								right: "10px",
							}}
						/>
					}
					defaultChecked={isDarkMode}
					onChange={() => setIsDarkMode(!isDarkMode)}
					label="Theme"
				/>
			</FormGroup>
			{pois &&
				pois.length > 0 &&
				pois.map(
					(poi) =>
						poi.latitude !== undefined &&
						poi.longitude !== undefined && (
							<Marker
								key={poi.id}
								latitude={poi.latitude}
								longitude={poi.longitude}
								onClick={() => handleMarkerClick(poi.id)}
							>
								<div>
									{getIconByCategory(
										poi.category?.name,
										poi.id === activePoiId
									)}
								</div>
							</Marker>
						)
				)}
		</Map>
	);
};
export default CityMap;
