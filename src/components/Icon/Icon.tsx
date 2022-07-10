import * as React from 'react';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/styles';

interface IconProps {
  path: string;
  imgStyle?: any;
};

const useStyles = makeStyles({
  imageIcon: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit',
  }
});

const CustomIcon = ({ path, imgStyle = {} } : IconProps) => {
  const classes = useStyles()

  return (
    <Icon style={{ color: 'inherit' }}>
      <img className={classes.imageIcon} style={imgStyle} src={path} alt=""/>
    </Icon>
  );
}

export default CustomIcon;