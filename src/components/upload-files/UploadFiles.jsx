import React from 'react';
import { useDropzone } from 'react-dropzone';
import { useField } from 'formik';
import { Typography, IconButton, Stack, Link, Box } from '@mui/material';
import { Upload, X } from 'lucide-react';
import { enqueue } from '../../store/slices/snakbar';
import { useDispatch } from 'react-redux';

const DropzoneField = ({ moduleCids, setModuleCids, name, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const dispatch = useDispatch();

  const { onBlur, value } = field;
  const { setValue } = helpers;
  const { touched, error } = meta;

  const MAX_SIZE = 5242880; // 5MB

  const onDrop = (acceptedFiles) => {
    const updatedFiles = acceptedFiles.map((file) =>
      new File([file], file.name, { type: 'application/json' })
    );

    const oversizedFiles = acceptedFiles.filter((file) => file.size > MAX_SIZE);

    if (oversizedFiles.length > 0) {
      dispatch(
        enqueue({
          message: 'Some files exceed the 5 MB limit. Please upload smaller files.',
          variant: 'error',
        })
      );
    }

    if (updatedFiles.length > 0) {
      setValue([
        ...value,
        ...updatedFiles.filter((file) => file.size <= MAX_SIZE),
      ]);
    } else {
      dispatch(
        enqueue({ message: 'Invalid file. Only JSON allowed.', variant: 'error' })
      );
    }
  };

  const handleFileDelete = (index) => {
    const updatedFiles = [...field.value];
    updatedFiles.splice(index, 1);
    const cidArray = moduleCids;
    cidArray.splice(index, 1);
    setModuleCids(cidArray)
    setValue(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'application/json': ['.json'],
    },
  });

  return (
    <>
      <Box
        {...getRootProps()}
        sx={{
          cursor: 'pointer',
          textAlign: 'center',
          border: '1px dashed #CDD6D5',
          borderRadius: '4px',
          background: '#ECEFEE',
          p: '1.5rem',
          height: "150px",
          display: "flex",
          justifyContent: "center",
          transition: '0.2s',
          '&.active': {
            borderColor: 'primary.main',
            background: '#E3F2FD',
          },
        }}
        className={isDragActive ? 'active' : ''}
      >
        <input {...getInputProps()} onBlur={onBlur} {...props} />
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
          <Upload size={16} />
          <Typography variant="body2">
            Drop JSON files here or <Link>click browse</Link>
          </Typography>
        </Stack>
      </Box>

      {touched && error && (
        <Typography color="error" textAlign="center" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      {field.value && Array.isArray(field.value) && field.value.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Selected Files:
          </Typography>
          <ul style={{ padding: '14px', margin: 0 }}>
            {field.value.map((file, index) => (
              <li
                key={index}
                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}
              >
                {file.name}
                <IconButton
                  aria-label="delete"
                  onClick={() => handleFileDelete(index)}
                  size="small"
                  sx={{ m: 1 }}
                >
                  <X size={12} />
                </IconButton>
              </li>
            ))}
          </ul>
        </Box>
      )}
    </>
  );
};

export default DropzoneField;