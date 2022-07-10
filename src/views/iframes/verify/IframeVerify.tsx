import React, { useEffect, useState } from "react";
import VerificationList from "../../../components/VerificationList/VerificationList";
import axios from 'axios';
import { BACK_URL } from '../../../utils/env';

const fetch_by_path = async (path:string, params: any = {}) => (await axios.get(`${BACK_URL}/api/${path}`, { params })).data.data

const IframeVerify = () => {
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
      <VerificationList files={files} rows_data={files} loading={loading} iframe={true}/>
    </>
  );
}

export default IframeVerify;