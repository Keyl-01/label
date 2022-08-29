import { IconCheckCircle } from "../../assets/icons";
import { Button } from "../../components/Button/Button";
import { modal } from "../../components/Modal/Modal";
import { useModalControls } from "../../components/Modal/ModalPopup";
import { Space } from '../../components/Space/Space';
import { Block, Elem } from "../../utils/bem";
import { isDefined } from "../../utils/helpers";
import "./StreamModal.styl";

export const finishStream = ({
  title,
  description,
  labelFinish,
  labelContinue,
  onFinish,
  onContinue,
  allowClose = false,
}) => modal({
  style: { width: 540 },
  allowClose,
  closeOnClickOutside: false,
  bare: true,
  body: () => {
    const ctrl = useModalControls();

    return (
      <Block name="stream-modal">
        <Elem name="title" tag="h1">{title}</Elem>
        <Elem name="finished" tag={IconCheckCircle}/>

        <Elem name="description" tag="p">
          {description}
        </Elem>

        <Space align="center">
          {isDefined(labelContinue) && (
            <Button onClick={() => {
              ctrl.hide();
              onContinue?.(ctrl);
            }}>
              {labelContinue}
            </Button>
          )}

          <Button look="primary" onClick={() => {
            ctrl.hide();
            onFinish?.(ctrl);
          }}>
            {labelFinish}
          </Button>
        </Space>
      </Block>
    );
  },
});
