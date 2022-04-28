import { Button, Container, Typography } from "@mui/material";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authLogout } from "../auth/apis";
import AuthContext from "../auth/AuthContext";

function Home() {

    const { user, setUser } = useContext(AuthContext);
    let navigate = useNavigate();

    return (
        <>
            <div className="parallax">
                <div className="parallax_center">
                    <div className="white-text caption" style={{ margin: "0px auto" }}>
                        <br />
                        <span style={{ margin: "0px auto 3px auto" }}>
                            Indian Institute of Technology, Bhilai
                        </span>
                        <h1
                            style={{
                                margin: "0px auto 3px auto",
                                fontSize: "4.3em",
                                fontWeight: "bold",
                            }}
                        >
                            Electronic Health Records
                        </h1>
                    </div>
                </div>
                <div style={{ position: "absolute", bottom: "25px", width: "100%", textAlign: "center" }}>
                    {
                        user ?
                            <Button
                                variant="contained"
                                onClick={() => {
                                    authLogout(setUser);
                                    console.log("in logout")
                                    navigate('/login');
                                    return;
                                }}
                            >
                                Logout
                            </Button>
                            :
                            <Button
                                variant="contained"
                                size="large"
                                component={Link}
                                to="/login"
                            >
                                Login
                            </Button>

                    }
                </div>
            </div>
            <Container sx={{ marginTop: 5 }}>
                <div style={{ height: "1000px", marginTop: 25 }}>
                    <Typography variant="h4" color="primary.dark" style={{ fontWeight: 700, fontSize: "2.5rem" }}>About</Typography>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae atque
                    quaerat beatae quam explicabo dolores, dolorum dolor molestias dolore,
                    quo veritatis totam eveniet unde vero sunt ratione magni fugiat ducimus Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae atque
                    quaerat beatae quam explicabo dolores, dolorum dolor molestias dolore,
                    quo veritatis totam eveniet unde vero sunt ratione magni fugiat ducimus?
                    <br />
                    <br />
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae atque
                    quaerat beatae quam explicabo dolores, dolorum dolor molestias dolore,
                    quo veritatis totam eveniet unde vero sunt ratione magni fugiat ducimus Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae atque
                    quaerat beatae quam explicabo dolores, dolorum dolor molestias dolore,
                    quo veritatis totam eveniet unde vero sunt ratione magni fugiat ducimus?
                    <br />
                    <br />
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae atque
                    quaerat beatae quam explicabo dolores, dolorum dolor molestias dolore,
                    quo veritatis totam eveniet unde vero sunt ratione magni fugiat ducimus Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae atque
                    quaerat beatae quam explicabo dolores, dolorum dolor molestias dolore,
                    quo veritatis totam eveniet unde vero sunt ratione magni fugiat ducimus?
                    <Typography variant="h4" color="primary.dark" style={{ marginTop: 40, fontWeight: 700, fontSize: "2.5rem" }}>Schedule</Typography>
                </div>

            </Container>
        </>
    );
}

export default Home;
