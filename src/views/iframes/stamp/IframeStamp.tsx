import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import DropzoneArea from '../../../components/DropzoneArea/DropzoneArea';
import { Card, CardContent } from '@mui/material';

const useStyles = makeStyles({
  card: {
    width: '100%', 
    borderRadius: '17px', 
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)'
  }
});

const IframeStamp = () => {
  const classes = useStyles();

  return (
    <Card className={classes.card} style={{ flexGrow: 1, height: '344px' }}>
      <CardContent style={{ flexGrow: 1, height: "90%" }}>
          <DropzoneArea
            onChange={(files:any) => console.log('Files:', files)}
            iframe={true}
          />
      </CardContent>
    </Card>
  );
}

export default IframeStamp;