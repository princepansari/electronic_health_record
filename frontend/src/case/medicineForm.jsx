import { Stack, IconButton, TextField, Button, Box, Typography } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Controller, useFieldArray } from "react-hook-form";

export default function MedicineForm({ control, errors, ...props }) {

    const { fields, append, remove } = useFieldArray({
        control,
        name: "medicines"
    });

    return (
        <Box>
            <Typography variant="h6">Medicines</Typography>
            <Stack spacing={2} sx={{ marginTop: 1 }}>
                {fields.map((field, index) => (
                    <Stack key={field.id} direction="row" spacing={2}>
                        <Controller
                            render={({ field }) => <TextField {...field} label="Enter Medicine"
                                error={errors?.medicines?.[index]?.medicine}
                                helperText={errors?.medicines?.[index]?.medicine?.message} />}
                            name={`medicines.${index}.medicine`}
                            control={control}

                        />
                        <Controller
                            render={({ field }) => <TextField {...field} label="Enter Dosage"
                                error={errors?.medicines?.[index]?.dosage}
                                helperText={errors?.medicines?.[index]?.dosage?.message}
                            />}
                            name={`medicines.${index}.dosage`}
                            control={control}
                        />
                        <IconButton onClick={() => { remove(index) }} ><RemoveCircleIcon /></IconButton>
                    </Stack>
                ))}

            </Stack>
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={() => append({ medicine: "", dosage: "" })}
            >
                Add Medicine
            </Button>
        </Box>





    );
}