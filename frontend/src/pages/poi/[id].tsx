import { useRouter } from "next/router"
import { useQuery } from "@apollo/client";
import Carousel from 'react-material-ui-carousel'

import { Breadcrumbs, Typography, Grid, Card, CardMedia, CardContent, Paper } from '@mui/material';

import { useEffect, useState } from "react";
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

    const { loading, error, data } = useQuery(GET_POI_BY_ID, {
        variables: { id: parseInt(router.query.id as string) },
});
console.log(data) 
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
    console.log(POIDetails)
    
    function Item(props: any) {
        return (
            <Paper>
                <img src={props.item} alt={`Image ${props.index}`} style={{ width: '100%' }} />
            </Paper>
        )
    }
return (
    <div>
        <Breadcrumbs aria-label="breadcrumb">
            <Typography color="textPrimary">{POI.city}</Typography>
            <Typography color="textPrimary">{POI.category}</Typography>
        </Breadcrumbs>
        <Grid container spacing={2}>
                <Carousel>
                    {
                    POI.images.map((imageUrl, i) => <Item key={i} item={imageUrl} index={i} />)
                    }
                </Carousel>
             
            <Grid item xs={6}>
                <Typography variant="h4">{POI.name}</Typography>
                Adresse :
                <Typography>{POI.address}</Typography>
                Description : 
                <Typography>{POI.description}</Typography>
            </Grid>
        </Grid>
    </div>
);
}


export default POIDetails;
