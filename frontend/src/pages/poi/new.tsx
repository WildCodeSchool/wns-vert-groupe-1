import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { styled } from '@mui/material/styles';
import { Paper, TextField, Select, MenuItem, Button, Grid, InputLabel, Typography, FormControl } from "@mui/material";
import { mainTheme } from "@theme";
import { GeoCodingService } from "../../services/GeoCodingService";
import { CREATE_NEW_POI } from "@mutations";
import { GET_ALL_CITIES, GET_ALL_CATEGORIES } from "@queries";
import { POIInput } from "@types";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from "axios";

const NewPoi = () => {
  const [imageURLs, setImageURLs] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<POIInput>();

  const { data: cityData } = useQuery<{
    getAllCities: {
      id: number;
      name: string;
    }[];
  }>(GET_ALL_CITIES);

  const { data: categoryData } = useQuery<{
    getAllCategories: {
      id: number;
      name: string;
    }[];
  }>(GET_ALL_CATEGORIES);

  const [createNewPoi] = useMutation(CREATE_NEW_POI);

  const onSubmit: SubmitHandler<POIInput> = async (formData: POIInput) => {
    try {
      const coordinates = await GeoCodingService.getCoordinates(formData.address);

      if (coordinates) {
        formData.latitude = coordinates.latitude;
        formData.longitude = coordinates.longitude;
      }

      const result = await createNewPoi({
        variables: {
          poiData: {
            name: formData.name,
            address: formData.address,
            postalCode: formData.postalCode,
            description: formData.description,
            images: imageURLs.map((image) => "http://localhost:8000" + image),
            city: Number.parseInt(formData.city),
            category: Number.parseInt(formData.category),
            latitude: formData.latitude,
            longitude: formData.longitude,
          },
        },
      });
      setImageURLs([]);
      reset();
    } catch (err: any) {
      console.error(err);
    }
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

// TODO : add redirection after submit, add form control and make all fields mandatory, fix image display
  if (cityData && categoryData) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ maxHeight: "75vh" }}>
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Paper
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              padding: mainTheme.spacing(3),
              borderRadius: mainTheme.spacing(2),
              boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.15)",
              marginTop: "1rem"
            }}
          >
            <Typography color={mainTheme.palette.primary.main} align="center" sx={{ fontSize: mainTheme.typography.h4, fontWeight: "bold" }}>Ajouter un POI</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Nom" {...register("name")} fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Adresse" {...register("address")} fullWidth margin="normal" />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Code Postal" {...register("postalCode")} fullWidth margin="normal" />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="city">Ville</InputLabel>
                  <Select label="Ville" labelId="city" {...register("city")} fullWidth color="primary">
                    {cityData?.getAllCities?.map((city) => (
                      <MenuItem key={city.id} value={city.id}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField label="Description" multiline rows={3} {...register("description")} fullWidth margin="normal" />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="category">Catégorie</InputLabel>
                  <Select label="Catégorie" labelId="category" {...register("category")} fullWidth color="primary">
                    {categoryData?.getAllCategories?.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <Button
                  component="label"
                  color="secondary"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Ajouter des images
                  <VisuallyHiddenInput type="file"
                    onChange={async (e: any) => {
                      if (e.target.files) {
                        const selectedFiles = Array.from(e.target.files);
                        const url = "http://localhost:8000/upload";
                        const uploadPromises = (selectedFiles as File[]).map(async (file: File) => {
                          const formData = new FormData();
                          formData.append("file", file, file.name);
                          try {
                            const response = await axios.post(url, formData);
                            console.log(response);
                            return response.data.filename;
                          } catch (err) {
                            console.log("error", err);
                            return null;
                          }
                        });

                        Promise.all(uploadPromises).then((filenames) => {
                          setImageURLs((prevImageURLs) => [
                            ...prevImageURLs,
                            ...filenames.filter((filename) => filename !== null),
                          ]);
                        });
                      }
                    }}
                    multiple />
                </Button>
              </Grid>
              <Grid item xs={12} />
              {imageURLs.map((url, index) => (
                <Grid key={index} item xs={2} sx={{ textAlign: "center" }}>
                  <img width={"100%"} alt={`uploadedImg${index}`} src={"http://localhost:8000" + url} />
                </Grid>
              ))}
            </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", }}>
                <Button type="submit" variant="contained" color="primary" >
                  Ajouter
                </Button>
              </Grid>
              
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default NewPoi;
