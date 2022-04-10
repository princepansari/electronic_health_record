import React, { useEffect, useState } from "react";
import { TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

const ProfileItem = ({ property, editable, control }) => {
  // useEffect(() => {

  //     console.log(value);
  // //   return () => {

  // //   }
  // }, [value]);

  return (
    <div>
      <Typography variant="h6" component="div">
        {property}
      </Typography>

      <Controller
        render={({ field }) => (
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            disabled={!editable}
            {...field}
          />
        )}
        name={property}
        control={control}
      />
    </div>
  );
};

export default ProfileItem;
