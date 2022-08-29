import { Block, Elem } from "../../utils/bem";
import "./ProgressBar.styl";

export const ProgressBar = ({
  min = 0,
  max = 100,
  value = 100,
  separator = "of",
}) => {
  return (
    <Block name="progressBar">
      <Elem name="done" style={{ width: `${value/(max-min)*100}%` }}></Elem>
      <Elem name="text" >{value} {separator} {max}</Elem>
    </Block>
  );
};
