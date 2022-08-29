import { IconWarning } from "../../assets/icons";
import { Block, Elem } from "../../utils/bem";
import "./Warning.styl";

export const Warning = ({
  description,
  extra,
}) => {
  return (
    <Block name="warning">
      <Elem name="main">
        <Elem name="description">
          {description}
        </Elem>
        <Elem name="icon">
          <IconWarning fill="#F4C348"/>
        </Elem>
      </Elem>
      {extra && (
        <Elem name="extra">{extra}</Elem>
      )}
    </Block>
  );
};
