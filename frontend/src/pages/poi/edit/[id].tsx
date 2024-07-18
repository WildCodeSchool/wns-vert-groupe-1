import { useMutation, useQuery } from "@apollo/client";
import { ImagesCarousel } from "@components";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { EDIT_POI_BY_ID } from "@mutations";
import { GET_POI_BY_ID } from "@queries";
import { mainTheme } from "@theme";
import { POIInput } from "@types";
import { useAuth } from "context";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const EditPoiByID = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { id } = router.query;

    const { data: poiData, error: poiError, loading: poiLoading } = useQuery(GET_POI_BY_ID, {
        variables: { getPoiByIdId: Number(id) },
    });

    const [editPoi, { data, error, loading }] = useMutation(EDIT_POI_BY_ID);

    const [form, setForm] = React.useState<POIInput>({
        name: "",
        address: "",
        postalCode: "",
        description: "",
        city: "",
        latitude: "",
        longitude: "",
        images: "",
        category: "",
    });

    useEffect(() => {
        if (poiData) {
            setForm({
                name: poiData.name || "",
                address: poiData.address || "",
                postalCode: poiData.postalCode || "",
                description: poiData.description || "",
                city: poiData.city || "",
                latitude: poiData.latitude || "",
                longitude: poiData.longitude || "",
                images: poiData.images || "",
                category: poiData.category || "",
            });
        }
    }, [poiData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await editPoi({ variables: { input: form } });
            toast.success("POI updated successfully");
            router.push(`/poi/${id}`);
        } catch (error) {
            toast.error("Error updating POI");
        }
    };

    if (poiLoading) return <p>Loading...</p>;
    if (poiError) return <p>Error loading POI data</p>;

    return (
        <Box sx={{ padding: "1rem" }}>
            <Grid container spacing={6}>
                <Grid item xs={6}>
                    <ImagesCarousel images={poiData.images} />
                </Grid>
                <Grid item xs={6}>
                    <Paper sx={{ padding: "1rem" }}>
                        <Typography
                            color={mainTheme.palette.primary.main}
                            align="center"
                            sx={{ fontSize: mainTheme.typography.h3, fontWeight: "bold" }}
                        >
                            Edit POI
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Address"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Postal Code"
                                name="postalCode"
                                value={form.postalCode}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="City"
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Latitude"
                                name="latitude"
                                value={form.latitude}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Longitude"
                                name="longitude"
                                value={form.longitude}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Images"
                                name="images"
                                value={form.images}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                                <Button variant="contained" color="primary" type="submit" disabled={loading}>
                                    {loading ? "Updating..." : "Update POI"}
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EditPoiByID;
