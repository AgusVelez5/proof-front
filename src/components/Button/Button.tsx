import React from "react";
import { Grid, GridSize } from "@material-ui/core";
import { BorderV, ColorV } from "../../style/type-style";

interface ButtonProps {
  label?: string;
  msg?: string;
  iconLeft?: React.ReactNode;
  children?: React.ReactNode;
  required?: boolean;
  iconRight?: React.ReactNode;
  error?: boolean;
  error_msg?: string;
  name?: string | undefined;
  value?: Date | string | number | undefined;
  multiline?: boolean;
  rows?: string | number;
  rowsMax?: string | number;
  placeholder?: string;
  className?: string;
  color?: ColorV;
  colorFont?: ColorV;
  onClick?: React.EventHandler<any>;
  xs?: undefined | GridSize;
  sm?: undefined | GridSize;
  md?: undefined | GridSize;
  lg?: undefined | GridSize;
  xl?: undefined | GridSize;
  borderRadius?: BorderV | undefined;
}

const Button = ({
  xs,
  sm,
  md,
  lg,
  xl,
  label,
  className,
  borderRadius = "small",
  children,
  color = "cian",
  colorFont = "black",
  onClick,
}: ButtonProps) => (
  <Grid
    item
    xs={xs}
    sm={sm}
    md={md}
    lg={lg}
    xl={xl}
    className={`p-top-1 p-bottom-1  ${className}`}
  >
    <button
      style={{
        width: "100%",
        borderRadius: `var(--border-${borderRadius})`,
        border: "0px"
      }}
      className={`background-color-${color} hover`}
      onClick={onClick}
    >
      {label ? (
        <p className={`color-${colorFont} m-1 w500`}>{label}</p>
      ) : (
        children
      )}
    </button>
  </Grid>
);

export default Button;