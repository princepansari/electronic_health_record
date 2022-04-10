import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ProfileItem from "./ProfileItem";

const buttonAreaStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  py: 2,
};

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const profileValues = {
    Name: "Lavish",
    "Email Address": "lavishg@iitbhilai.ac.in",
    "Date of Birth": "01/01/2022",
    "Contact Number": "1234567890",
    Allergies: "Nothing",
  };

  // const [fakeProfile, setFakeProfile] = useState([
  //   {
  //     property: "Name",
  //     value: "Lavish",
  //   },
  //   {
  //     property: "Email Address",
  //     value: "lavishg@iitbhilai.ac.in",
  //   },
  //   {
  //     property: "Date of Birth",
  //     value: "01/01/2022",
  //   },
  //   {
  //     property: "Contact Number",
  //     value: "1234567890",
  //   },
  //   {
  //     property: "Allergies",
  //     value: "Nothing",
  //   },
  // ]);

  // const defaultValues = fakeProfile.reduce(
  //   (obj, elm) => ({ ...obj, [elm.property]: elm.value }),
  //   {}
  // );

  const {
    control,
    handleSubmit: RHFhandleSubmit,
    reset,
  } = useForm({ defaultValue: profileValues });

  const initValues = () => {
    // TODO : fetch data

    reset(profileValues);
  };

  const handleSubmit = (data) => {
    if (!isEditing) setIsEditing(true);
    else {
      console.log(data);
      // TODO : update data
      initValues();
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    initValues();
    setIsEditing(false);
  };

  useEffect(() => {
    initValues();

    return () => {};
  }, []);

  // const updateValueAt = (newValue , index) => {
  //   setFakeProfile(prevProfile => {
  //     prevProfile[index].value = newValue;
  //     return prevProfile;
  //   });
  //   console.log('fakeProfile : ' , fakeProfile);
  // };

  return (
    <div>
      <Typography
        variant="h3"
        component="div"
        textAlign="center"
        sx={{ py: 2 }}
      >
        Profile
      </Typography>

      <form onSubmit={RHFhandleSubmit(handleSubmit)}>
        {Object.keys(profileValues).map((property, index) => (
          <ProfileItem
            key={index}
            property={property}
            editable={isEditing}
            control={control}
          />
        ))}

        <Box sx={buttonAreaStyle}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
          {isEditing && (
            <Button
              variant="outlined"
              color="error"
              size="large"
              onClick={handleCancel}
              sx={{ ml: 5 }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </form>
    </div>
  );
};

export default ProfilePage;
