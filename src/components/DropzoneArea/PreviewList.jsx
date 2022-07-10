import React, { useState } from "react";
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Grid,
  Button
} from "@material-ui/core";
import axios from 'axios';
import { BACK_URL } from '../../utils/env';
import Fade from '@mui/material/Fade';
import { useSnackbar } from "notistack";
import CircularProgress from '@mui/material/CircularProgress';

const styles = ({palette, shape, spacing}) => ({
  root: {},
  imageContainer: {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    '&:hover $image': {
      opacity: 0.3,
    },
    '&:hover $removeButton': {
      opacity: 1,
    },
  },
  image: {
    height: 50,
    color: palette.text.primary,
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    boxSizing: 'border-box',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0 1px 6px, rgba(0, 0, 0, 0.12) 0 1px 4px',
    borderRadius: shape.borderRadius,
    zIndex: 5,
    opacity: 1,
  },
  button: { 
    background: "#FFFFFF 0% 0% no-repeat padding-box", 
    border: "1px solid #1C3B72",
    borderRadius: "13px", 
    fontSize: "14px", 
    color: '#1C3B72',
    textTransform: 'none', 
    height: "22px",
    width: "133px",
    fontFamily: 'Montserrat, sans-serif',
    '&:hover': {
      color: '#FFFFFF',
      background: '#C3C3C3',
      border: "1px solid #C3C3C3",
    }, 
  },
  removeButton: {
    transition: '.5s ease',
    position: 'absolute',
    opacity: 0,
    top: spacing(-2),
    right: spacing(5),
    width: 40,
    height: 40,
    '&:focus': {
      opacity: 1,
    },
  },
});

const stamp = async (file, data) => (await axios({
  method: 'post',
  url: `${BACK_URL}/api/stamp`,
  headers: {
    "content-type": "multipart/form-data",
  },
  data: file,
  params: data
})).data.data

function PreviewList({
  fileObjects,
  handleRemove,
  showFileNames,
  previewGridClasses,
  previewGridProps,
  classes,
  getPreviewIcon,
  iframe,
  handleReset,
  onStamp
}) {
  const { enqueueSnackbar } = useSnackbar()
  const [stampLoading, setStampLoading] = useState(false);

  const handleStamp = async () => {
    return
    const res = await Promise.all(fileObjects.map(f => {
      const data = new FormData();
      data.append('file', f.data);
      return stamp(data, { name: f.file.name })
    }))

    if (!iframe) {
      fileObjects.map((f, i) =>
        enqueueSnackbar(
          <div style={{ color: "#1C3B72"}}>{res[i].includes('Stamping') ? `${f.file.name} enviado a estampar` : `${f.file.name} ya fue estampado previamente`}</div>,
          res[i].includes('Stamping') ? 
          {
            variant: "success",
            persist: false,
            TransitionComponent: Fade,
            sx: {
              "& .SnackbarContent-root": { background: "#FFFFFF", borderColor: "#1C3B72", borderWidth: "55px", color: "#1C3B72" }
            }
          } 
          : 
          {
            variant: "error",
            persist: false,
            TransitionComponent: Fade,
            sx: {
              "& .SnackbarContent-root": { background: "#FFFFFF", borderColor: "#1C3B72", borderWidth: "55px", color: "#CC0A0A" }
            }
          }
        )
      )
    }
    
  }

 /*  const handleReset = () => {
    console.log('handleReset', fileObjects)
    for (let i = 0; i < fileObjects.length; i++) {
      console.log('handleReset for ', i)
      handleRemove(i)
      console.log('handleReset for CULEAAA ', i)
    }
  } */

  const onFormSubmit = async (e) => {
    e.preventDefault()
    console.log('form xumbit')
    setStampLoading(true)
    console.log('form xumbit2')
    await handleStamp()
    console.log('form xumbit3')
    console.log('form xumbit4')
    onStamp(fileObjects.map(f => f.file.name))
    console.log('form xumbit5')
    handleReset()
    setStampLoading(false)
    console.log('form xumbit6', fileObjects)
  }

  return (
    <>
      <Grid
        container
        className="p-top-1"
        style={{ height: "100%", flexGrow: 1 }}
      >
        <form onSubmit={onFormSubmit} style={{ height: '100%', width: '100%' }}>
          <Grid container direction="column" justifyContent="space-between" style={{ height: '100%', width: '100%' }}>
            <Grid container justifyContent="flex-start" alignContent="flex-start">
              {fileObjects.map((fileObject, i) => {
                return (
                  <Grid
                      xs={4}
                      {...previewGridProps.item}
                      item={true}
                      key={`${fileObject.file?.name ?? 'file'}-${i}`}
                      className={clsx(classes.imageContainer, previewGridClasses.item)}
                  >
                      {getPreviewIcon(fileObject, classes)}

                      {showFileNames && (
                          <Typography variant="body1" component="p">
                              {fileObject.file.name}
                          </Typography>
                      )}

                      <Fab
                          onClick={handleRemove(i)}
                          aria-label="Delete"
                          className={classes.removeButton}
                      >
                          <DeleteIcon />
                      </Fab>
                  </Grid>
                );
              })}
            </Grid>
            <Grid container justifyContent="flex-end" alignContent="flex-end">
              <Button type="sumbit" variant="outlined" className={classes.button}>
                {stampLoading && <CircularProgress style={{ color: '#1C3B72' }} size={14} />}
                {!stampLoading && 'Estampar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </>
  );
}

PreviewList.propTypes = {
  classes: PropTypes.object.isRequired,
  fileObjects: PropTypes.arrayOf(PropTypes.object).isRequired,
  getPreviewIcon: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  previewChipProps: PropTypes.object,
  previewGridClasses: PropTypes.object,
  previewGridProps: PropTypes.object,
  showFileNames: PropTypes.bool,
  useChipsForPreview: PropTypes.bool,
};

export default withStyles(styles, {name: 'MuiDropzonePreviewList'})(PreviewList);