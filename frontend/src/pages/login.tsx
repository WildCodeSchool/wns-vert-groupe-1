import { useLazyQuery } from "@apollo/client";
import { UserContext } from "@components";
import { LOGIN } from "@queries";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Grid, TextField, Button, Paper, Box, FormControlLabel, Checkbox, Typography, Link } from "@mui/material";

const LoginPage = () => {
    const router = useRouter();
    const authInfo = useContext(UserContext);

    const [handleLogin] = useLazyQuery(LOGIN, {
        async onCompleted(data) {
            localStorage.setItem("jwt", data.login);
            authInfo.refetchLogin();
            router.push("/");
        },
    });

    return (
        <Box
            height="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Paper variant="elevation" elevation={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <Grid container spacing={4}>
                    <Grid
                        item
                        xs={12}
                        md={6}
                        order={-1}
                        display="flex"
                        alignItems="center"
						justifyContent="flex-start"
                        sx={{
                            px: 0,
                            '& img': {
                                m: 0,
                                ml: -10,
                                height: '100%',
                            }
                        }}
                    >
                        <Box
                            height="100%"
                            display="flex"
                            alignItems="flex-start"
                        >
                            <img src="/images/login.png" alt="login" style={{ width: "auto", maxWidth: '100%' }} />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ p: 2, ml: '-70px' }}>
                        <Typography 
						variant="h3" 
						color="primary" 
						align="center" 
						gutterBottom 
						fontWeight="bold"
						style={{ marginBottom: "4rem", marginTop: "2rem" }}
						>
                            Se connecter
                        </Typography>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.target;
                                const formData = new FormData(form as HTMLFormElement);

                                const formJson = Object.fromEntries(formData.entries());

                                handleLogin({
                                    variables: {
                                        userData: formJson,
                                    },
                                });
                            }}
                        >
                            <TextField
                                name="email"
                                fullWidth
                                label="Email"
                                id="standard-basic" 
                                variant="standard"
                                style={{ marginBottom: "3rem" }}
                            />
                            <TextField
                                name="password"
                                fullWidth
                               label="Mot de passe"
                                id="standard-basic"
                                variant="standard"
                                type="password"
                                style={{ marginBottom: "3rem" }}
                            />
                         <FormControlLabel
  							control={<Checkbox name="rememberMe" />}
  							label="Se souvenir de moi"
						/>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                                style={{ marginBottom: "2rem", marginTop: "1rem", borderRadius: "24px", }}
                            >
                                Envoyer
                            </Button>
							<Typography 
								gutterBottom
								color="primary"
								variant="subtitle1"
								align="center"
								sx={{ fontSize: '1rem', textAlign: 'center' }}
			  				>
							Pas encore de compte ? 
							<Link href="/register" underline="hover" sx={{ fontSize: '1rem', color: 'primary' }}> S'inscrire</Link>
              				</Typography>
							  <Typography 
								gutterBottom
								color="primary"
								variant="subtitle1"
								align="center"
								sx={{ fontSize: '1rem', textAlign: 'center' }}
			  				>
							Mot de passe oublié ? 
							<Link href="/register" underline="hover" sx={{ fontSize: '1rem', color: 'primary' }}> Réinitialiser</Link>
              				</Typography>
                        </form>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default LoginPage;