import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import Carousel from 'react-material-ui-carousel'
import { Breadcrumbs, ImageList, ImageListItem, Typography, Grid, Paper, Link } from '@mui/material';
import { GET_POI_BY_ID } from "@queries";
import { POIInput } from "@types";
import { mainTheme } from "@theme";
import PlaceIcon from '@mui/icons-material/Place';
import { ImagesCarousel } from '@components';

const POIDetails = () => {
    const router = useRouter();
    const [POI, setPOI] = useState<POIInput>({
        name: "",
        address: "",
        description: "",
        images: [],
        city: "",
        category: "",
    });

	const { loading, error, data } = useQuery(GET_POI_BY_ID, {
		variables: { id: parseInt(router.query.id as string) },
	});

	useEffect(() => {
		if (!loading && data && data.getPoiById) {
			setPOI({
				name: data.getPoiById.name,
				address: data.getPoiById.address,
				description: data.getPoiById.description,
				images: data.getPoiById.images,
				city: data.getPoiById.city.name,
				category: data.getPoiById.category.name,
			});
		}
	}, [data, error, router.query.id]);

	function Item(props: { item: string; index: number }) {
		return (
			<Paper>
				<img
					src={props.item}
					alt={`Image ${props.index}`}
					style={{ width: "100%" }}
				/>
			</Paper>
		);
	}

    const handleCityClick = () => {
        router.push(`/city/search/${POI.city}`);
    };    

    const handleCategoryClick = () => {
        router.push(`/city/search/${POI.city}/category/${POI.category}`);
    };   
    const carouselImageStyle = {
        width: '100%', 
        height: '300px', 
        objectFit: 'cover', 
    };
    return (
			<div>
				<Breadcrumbs
					aria-label="breadcrumb"
					separator="›"
					sx={{ marginTop: "1rem", marginLeft: "1rem" }}
				>
					<Link
						underline="hover"
						onClick={handleCityClick}
						sx={{ fontSize: mainTheme.typography.h6, fontWeight: "light" }}
						color={mainTheme.palette.primary.dark}
					>
						{POI.city}
					</Link>
					<Link
						underline="hover"
						onClick={handleCategoryClick}
						sx={{ fontSize: mainTheme.typography.h6, fontWeight: "light" }}
						color={mainTheme.palette.primary.dark}
					>
						{POI.category}
					</Link>
					<Link
						underline="hover"
						sx={{ fontSize: mainTheme.typography.h6, fontWeight: "light" }}
						color={mainTheme.palette.primary.dark}
					>
						{POI.name}
					</Link>
				</Breadcrumbs>
				return (
			<div>
			</div>
		);
}

export default POIDetails;
