import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from "@material-ui/core";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Fragment } from 'react';
import Dropzone from 'react-dropzone';
import { convertBytesToMbsOrKbs, readFile } from './utils/utils';
import PreviewList from './PreviewList';
import SnackbarContentWrapper from './SnackbarContentWrapper';
import IconButton from '@mui/material/IconButton';

const styles = ({palette, shape, spacing}) => ({
  '@keyframes progress': {
    '0%': {
      backgroundPosition: '0 0',
    },
    '100%': {
      backgroundPosition: '-70px 0',
    },
  },
  root: {
    position: 'relative',
    width: '100%',
    minHeight: '250px',
    backgroundColor: palette.background.paper,
    boxSizing: 'border-box',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  active: {
    animation: '$progress 2s linear infinite !important',
    // eslint-disable-next-line max-len
    backgroundImage: `repeating-linear-gradient(-45deg, ${palette.background.paper}, ${palette.background.paper} 25px, ${palette.divider} 25px, ${palette.divider} 50px)`,
    backgroundSize: '150% 100%',
    border: 'solid',
    borderColor: palette.primary.light,
  },
  invalid: {
    // eslint-disable-next-line max-len
    backgroundImage: `repeating-linear-gradient(-45deg, ${palette.error.light}, ${palette.error.light} 25px, ${palette.error.dark} 25px, ${palette.error.dark} 50px)`,
    borderColor: palette.error.main,
  },
  textContainer: {
    padding: '15px'
  },
  text: {
    marginBottom: spacing(3),
    marginTop: spacing(3),
    color: '#707070',
    fontSize: '20px'
  }
});

const defaultSnackbarAnchorOrigin = {
  horizontal: 'left',
  vertical: 'bottom',
};

const defaultGetPreviewIcon = (fileObject, classes) => {
  const icons = {
    image: (<img
            className={classes.image}
            role="presentation"
            src={fileObject.data}
            alt=""
        />),
    audio: <AudioFileIcon />,
    video: <VideoFileIcon />,
    'text/plain': <TextSnippetIcon />,
    'application/pdf': <TextSnippetIcon style={{ color: "black", fontSize: 30}} />,
    'application/zip': <FolderZipIcon />
  }

  const file_type = fileObject.file.type.includes('image') ? 'image' : fileObject.file.type.includes('audio') ? 'audio' : fileObject.file.type.includes('video') ? 'video' : fileObject.file.type
  if (icons[file_type]) {
    if(file_type === 'image')
      return icons[file_type]

    return (
      <Grid justifyContent='center' alignContent='center' style={{ height: '50px',}}>
        <IconButton disabled>
          {icons[file_type]}
        </IconButton>
      </Grid>
    )
  }

  return <AttachFileIcon className={classes.icon} />;
};

class DropzoneAreaBase extends React.PureComponent {
  state = {
    openSnackBar: false,
    snackbarMessage: '',
    snackbarVariant: 'success',
  };

  notifyAlert() {
    const {onAlert} = this.props;
    const {openSnackBar, snackbarMessage, snackbarVariant} = this.state;
    if (openSnackBar && onAlert) {
      onAlert(snackbarMessage, snackbarVariant);
    }
  }

  handleDropAccepted = async(acceptedFiles, evt) => {
    const {fileObjects, filesLimit, getFileAddedMessage, getFileLimitExceedMessage, onAdd, onDrop} = this.props;

    if (filesLimit > 1 && fileObjects.length + acceptedFiles.length > filesLimit) {
      this.setState({
        openSnackBar: true,
        snackbarMessage: getFileLimitExceedMessage(filesLimit),
        snackbarVariant: 'error',
      }, this.notifyAlert);
      return;
    }

    // Notify Drop event
    if (onDrop) {
      onDrop(acceptedFiles, evt);
    }

    // Retrieve fileObjects data
    const fileObjs = await Promise.all(
      acceptedFiles.map(async(file) => {
        const data = await readFile(file);
        return { file, data };
      })
    );

    // Notify added files
    if (onAdd)
      onAdd(fileObjs);
    

    // Display message
    const message = fileObjs.reduce((msg, fileObj) => msg + getFileAddedMessage(fileObj.file.name), '');
    this.setState({
      openSnackBar: true,
      snackbarMessage: message,
      snackbarVariant: 'success'
    }, this.notifyAlert);
  }

  handleDropRejected = (rejectedFiles, evt) => {
    const {
      acceptedFiles,
      filesLimit,
      fileObjects,
      getDropRejectMessage,
      getFileLimitExceedMessage,
      maxFileSize,
      onDropRejected,
    } = this.props;

    let message = '';
    if (fileObjects.length + rejectedFiles.length > filesLimit) {
      message = getFileLimitExceedMessage(filesLimit);
    } else {
      rejectedFiles.forEach((rejectedFile) => {
        message = getDropRejectMessage(rejectedFile, acceptedFiles, maxFileSize);
      });
    }

    if (onDropRejected)
      onDropRejected(rejectedFiles, evt);

    this.setState({
      openSnackBar: true,
      snackbarMessage: message,
      snackbarVariant: 'error',
    }, this.notifyAlert);
  }

  handleRemove = (fileIndex) => (event) => {
    event.stopPropagation();

    const {fileObjects, onDelete} = this.props;

    // Find removed fileObject
    const removedFileObj = fileObjects[fileIndex];

    // Notify removed file
    if (onDelete)
      onDelete(removedFileObj, fileIndex);
  
  };

  handleCloseSnackbar = () => {
    this.setState({
      openSnackBar: false,
    });
  };

  handleReset = () => (event) => {
    event.stopPropagation();

    const { onReset } = this.props;

    if (onReset)
      onReset();
  };

  render() {
    const {
      acceptedFiles,
      alertSnackbarProps,
      classes,
      disableRejectionFeedback,
      dropzoneClass,
      dropzoneParagraphClass,
      dropzoneProps,
      dropzoneText,
      fileObjects,
      filesLimit,
      getPreviewIcon,
      inputProps,
      maxFileSize,
      previewChipProps,
      previewGridClasses,
      previewGridProps,
      showAlerts,
      showFileNames,
      showPreviewsInDropzone,
      useChipsForPreview,
      iframe,
      onStamp
    } = this.props;
    const {openSnackBar, snackbarMessage, snackbarVariant} = this.state;

    const acceptFiles = acceptedFiles?.join(',');
    const isMultiple = filesLimit > 1;
    const previewsInDropzoneVisible = showPreviewsInDropzone && fileObjects.length > 0;

    console.log('fileObjects', fileObjects)

    return (
      <Fragment>
        {previewsInDropzoneVisible ?
          <PreviewList
            fileObjects={fileObjects}
            handleRemove={this.handleRemove}
            getPreviewIcon={getPreviewIcon}
            showFileNames={showFileNames}
            useChipsForPreview={useChipsForPreview}
            previewChipProps={previewChipProps}
            previewGridClasses={previewGridClasses}
            previewGridProps={previewGridProps}
            iframe={iframe}
            handleReset={this.handleReset}
            onStamp={onStamp}
          />
        :
          <Dropzone
            {...dropzoneProps}
            accept={acceptFiles}
            onDropAccepted={this.handleDropAccepted}
            onDropRejected={this.handleDropRejected}
            maxSize={maxFileSize}
            multiple={isMultiple}
          >
            {({getRootProps, getInputProps, isDragActive, isDragReject}) => (
              <div
                {...getRootProps({
                  className: clsx(
                    classes.root,
                    dropzoneClass,
                    isDragActive && classes.active,
                    (!disableRejectionFeedback && isDragReject) && classes.invalid,
                  ),
                })}
              >
                <input {...getInputProps(inputProps)} />
                <div className={classes.textContainer}>
                  <Grid container direction="column" alignContent="center">
                    <Typography style={{ color: "#707070", fontSize: "20px" }} >
                      Arrastra los archivos o haz <strong>click aquí</strong>.
                    </Typography>
                    <img src={`./assets/images/box.svg`} style={{ maxHeight: '237px', maxWidth: '352px' }} alt="" />
                  </Grid>
                </div>
              </div>
            )}
          </Dropzone>
        }
        {((typeof showAlerts === 'boolean' && showAlerts) ||
          (Array.isArray(showAlerts) && showAlerts.includes(snackbarVariant))) &&
          <Snackbar
            anchorOrigin={defaultSnackbarAnchorOrigin}
            autoHideDuration={6000}
            {...alertSnackbarProps}
            open={openSnackBar}
            onClose={this.handleCloseSnackbar}
          >
            <SnackbarContentWrapper
                onClose={this.handleCloseSnackbar}
                variant={snackbarVariant}
                message={snackbarMessage}
            />
          </Snackbar>
        }
      </Fragment>
    );
  }
}

DropzoneAreaBase.defaultProps = {
  iframe: false,
  acceptedFiles: [],
  filesLimit: 6,
  fileObjects: [],
  maxFiles: 5,
  maxFileSize: 300000000,
  dropzoneText: 'Arrastra los archivos o haz click aquí.',
  previewText: 'Preview:',
  disableRejectionFeedback: false,
  showPreviews: false, 
  showPreviewsInDropzone: true,
  showFileNames: true,
  showFileNamesInPreview: false,
  useChipsForPreview: false,
  previewChipProps: {},
  previewGridClasses: {},
  previewGridProps: {},
  showAlerts: false,
  alertSnackbarProps: {
    anchorOrigin: {
      horizontal: 'left',
      vertical: 'bottom',
    },
    autoHideDuration: 6000,
  },
  getFileLimitExceedMessage: (filesLimit) => (`Maximum allowed number of files exceeded. Only ${filesLimit} allowed`),
  getFileAddedMessage: (fileName) => (`File ${fileName} successfully added.`),
  getPreviewIcon: defaultGetPreviewIcon,
  getFileRemovedMessage: (fileName) => (`File ${fileName} removed.`),
  getDropRejectMessage: (rejectedFile, acceptedFiles, maxFileSize) => {
    let message = `File ${rejectedFile.name} was rejected. `;
    if (!acceptedFiles.includes(rejectedFile.type)) {
      message += 'File type not supported. ';
    }
    if (rejectedFile.size > maxFileSize) {
      message += 'File is too big. Size limit is ' + convertBytesToMbsOrKbs(maxFileSize) + '. ';
    }
    return message;
  },
};

export const FileObjectShape = PropTypes.shape({
    file: PropTypes.object,
    data: PropTypes.any,
});

DropzoneAreaBase.propTypes = {
  iframe: PropTypes.bool,
  onStamp:PropTypes.func,
  classes: PropTypes.object.isRequired,
  acceptedFiles: PropTypes.arrayOf(PropTypes.string),
  filesLimit: PropTypes.number,
  Icon: PropTypes.elementType,
  fileObjects: PropTypes.arrayOf(FileObjectShape),
  maxFileSize: PropTypes.number,
  dropzoneText: PropTypes.string,
  dropzoneClass: PropTypes.string,
  dropzoneParagraphClass: PropTypes.string,
  disableRejectionFeedback: PropTypes.bool,
  showPreviews: PropTypes.bool,
  showPreviewsInDropzone: PropTypes.bool,
  showFileNames: PropTypes.bool,
  showFileNamesInPreview: PropTypes.bool,
  useChipsForPreview: PropTypes.bool,
  previewChipProps: PropTypes.object,
  previewGridClasses: PropTypes.object,
  previewGridProps: PropTypes.object,
  previewText: PropTypes.string,
  showAlerts: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.oneOf(['error', 'success', 'info'])),
  ]),
  alertSnackbarProps: PropTypes.object,
  dropzoneProps: PropTypes.object,
  inputProps: PropTypes.object,
  getFileLimitExceedMessage: PropTypes.func,
  getFileAddedMessage: PropTypes.func,
  getFileRemovedMessage: PropTypes.func,
  getDropRejectMessage: PropTypes.func,
  getPreviewIcon: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onReset: PropTypes.func,
  onDrop: PropTypes.func,
  onDropRejected: PropTypes.func,
  onAlert: PropTypes.func,
};

export default withStyles(styles, {name: 'MuiDropzoneArea'})(DropzoneAreaBase);