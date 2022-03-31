import { Stack, IconButton, TextField, Button, Box, Typography } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Controller, useFieldArray } from "react-hook-form";

export default function LabTestsForm({ control, errors, ...props }) {

    const { fields, append, remove } = useFieldArray({
        control,
        name: "labtests"
    });

    return (
        <Box>
            <Typography variant="h6">Lab Tests</Typography>
            <Stack spacing={2} sx={{ marginTop: 1 }}>
                {fields.map((field, index) => (
                    <Stack key={field.id} direction="row" spacing={2}>
                        <Controller
                            render={({ field }) => <TextField {...field} label="Enter Test Name"
                                error={errors?.labtests?.[index]?.testname !== undefined}
                                helperText={errors?.labtests?.[index]?.testname?.message} />}
                            name={`labtests.${index}.testname`}
                            control={control}
                        />
                        <Controller
                            defaultValue={index}
                            render={({ field }) => <TextField type='number' sx={{ display: 'none' }} {...field} />}
                            name={`labtests.${index}.id`}
                            control={control}
                        />
                        <Controller
                            defaultValue={''}
                            render={({ field }) => <TextField sx={{ display: 'none' }} {...field} />}
                            name={`labtests.${index}.reportLink`}
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
                onClick={() => append({ testname: "" })}
            >
                Add Test
            </Button>
        </Box>
    );
}