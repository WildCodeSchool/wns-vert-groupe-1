import { useState, useEffect } from 'react';
import { useRouter } from "next/router"
import { useQuery } from "@apollo/client";
import Carousel from 'react-material-ui-carousel'

import { ImageList, ImageListItem, Typography, Grid, Paper } from '@mui/material';
import { Breadcrumbs } from '@mui/material';
import { GET_POI_BY_ID } from "@queries";
import { POIInput } from "@types";

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

    // State pour suivre l'index de l'image sélectionnée dans la liste
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

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

    function Item(props: any) {
        return (
            <Paper>
                <img src={props.item} alt={`Image ${props.index}`} style={{ width: '100%' }} />
            </Paper>
        )
    }

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        console.log(selectedImageIndex)
    };
console.log(POI.images)
    return (
        <div>
            <Breadcrumbs aria-label="breadcrumb">
                <Typography color="textPrimary">{POI.city}</Typography>
                <Typography color="textPrimary">{POI.category}</Typography>
            </Breadcrumbs>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Carousel autoPlay={false} index={selectedImageIndex !== null ? selectedImageIndex : undefined}>
                        {POI.images.map((imageUrl, i) => <Item key={i} item={imageUrl} index={i} />)}
                    </Carousel>
                    <ImageList sx={{ width: 400, height: 100 }} cols={3} rowHeight={100}>
                        {POI.images.map((imageUrl, i) => (
                            <ImageListItem key={i} onClick={() => handleImageClick(i)}>
                                <img src={imageUrl} loading="lazy" />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h4">{POI.name}</Typography>
                    <Typography>Adresse: {POI.address}</Typography>
                    <Typography>Description: {POI.description}</Typography>
                </Grid>
            </Grid>
        </div>
    );
}

export default POIDetails;
