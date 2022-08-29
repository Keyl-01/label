import React, { forwardRef } from "react";
import { Block } from "../../utils/bem";
import "./Tag.styl";

export const Tag = forwardRef(({ className, size, children, ...props }, ref) => {
  return (
    <Block ref={ref} tag="span" name="tag" mod={{ size }} mix={className} {...props}>
      {children}
    </Block>
  );
});
