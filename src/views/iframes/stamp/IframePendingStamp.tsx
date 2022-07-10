import React, { useEffect, useState } from "react";
import PendingList from "../../../components/PendingList/PendingList";
import axios from 'axios';
import { BACK_URL } from '../../../utils/env';
import TableSkeleton from "../../../components/Skeletons/TableSkeleton";
import { Grid } from "@material-ui/core";
import { Card, CardContent } from '@mui/material';
import { makeStyles } from "@material-ui/core/styles";

const fetch_by_path = async (path:string, params: any = {}) => (await axios.get(`${BACK_URL}/api/${path}`, { params })).data.data

const useStyles = makeStyles({
  card: {
    width: '100%', 
    borderRadius: '17px', 
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)'
  }
});

const IframePendingStamp = () => {
  const classes = useStyles();
  const [files, setFiles] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => await fetch_by_path('file_data').then(r => {
      setFiles(r)
      setLoading(false);
    }))();
  }, []);

  return (
    <>
      {loading ?
        <Card className={classes.card}>
          <CardContent>
            <Grid container justifyContent="center" alignItems="center">
              <TableSkeleton style={{ width: '100%', height: 'auto' }} />
            </Grid>
          </CardContent>
        </Card>
      : 
        <PendingList rows_data={files.filter((f:any) => f.stamped === false)} iframe={true}/>
      }
    </>
  );
}

export default IframePendingStamp;