import { useState, useEffect } from 'react';
import { useRouter } from "next/router"
import { useQuery } from "@apollo/client";
import Carousel from 'react-material-ui-carousel'
import { Breadcrumbs, ImageList, ImageListItem, Typography, Grid, Paper, Divider } from '@mui/material';
import { GET_POI_BY_ID } from "@queries";
import { POIInput } from "@types";
import { mainTheme } from "@theme";
import PlaceIcon from '@mui/icons-material/Place';

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
            <Breadcrumbs aria-label="breadcrumb" sx={{ marginTop: '1rem', marginLeft: '1rem' }}>
                <Typography sx={{ fontSize: mainTheme.typography.h6, fontWeight: "light" }} color={mainTheme.palette.primary.dark}>{POI.city}</Typography>
                <Typography sx={{ fontSize: mainTheme.typography.h6, fontWeight: "light" }} color={mainTheme.palette.primary.dark}>{POI.category}</Typography>
                <Typography sx={{ fontSize: mainTheme.typography.h6, fontWeight: "light"}} color={mainTheme.palette.primary.dark}>{POI.name}</Typography>
            </Breadcrumbs>
            <Grid container spacing={6} sx={{ padding: '1rem' }}>
                <Grid item xs={6}>
                    <Carousel autoPlay={false} index={selectedImageIndex !== null ? selectedImageIndex : undefined}>
                        {POI.images.map((imageUrl, i) => <Item key={i} item={imageUrl} index={i} />)}
                    </Carousel>
                    <ImageList sx={{ width: 400, height: 100 }} cols={3}>
                        {POI.images.map((imageUrl, i) => (
                            <ImageListItem key={i} onClick={() => handleImageClick(i)}>
                                <img src={imageUrl} loading="lazy" />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Grid>
                <Grid item xs sx={{ padding: '1rem' }}>
                    <Typography color={mainTheme.palette.primary.main} align="center" sx={{ fontSize: mainTheme.typography.h3, fontWeight: "bold" }}>{POI.name}</Typography>
                    <Typography align="justify" sx={{ fontSize: mainTheme.typography.h6, marginTop: '3rem' }}>{POI.description}</Typography>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '3rem' }}>
                        <PlaceIcon color="primary" />
                        <Typography sx={{ fontSize: mainTheme.typography.h6 }}>{POI.address}</Typography>
                    </div>
                    <Typography color={mainTheme.palette.primary.main} align="left" sx={{ fontSize: mainTheme.typography.h4, fontWeight: "bold", marginTop: '3rem' }}>NOTE</Typography>
                    <Typography color={mainTheme.palette.primary.main} align="left" sx={{ fontSize: mainTheme.typography.h4, fontWeight: "bold", marginTop: '3rem' }}>COMMENTAIRES</Typography>
                </Grid>
            </Grid>

        </div>
    );
}

export default POIDetails;
