import React, { useState } from "react";
import { Block, cn } from "../../../utils/bem";
import { Button } from "../../../components";
import { Form, Input } from "../../../components/Form";
import { RadioGroup } from "../../../components/Form/Elements/RadioGroup/RadioGroup";
import { Tooltip } from "../../../components/Tooltip/Tooltip";

const colors = [
  '#FFFFFF',
  '#F52B4F',
  '#FA8C16',
  '#F6C549',
  '#9ACA4F',
  '#51AAFD',
  '#7F64FF',
  '#D55C9D',
];

const disabledClassName = cn("edit-workspace").elem("delete").mod({ disabled: true });

export const WorkspaceModal = ({ workspace, empty, onClose, onDelete, onSubmit }) => {
  const [loading, setLoading] = useState();

  const loadingWrapper = fn => fn && (async () => {
    setLoading(true);
    await fn();
    setLoading(false);
  });

  return (
    <Form
      action={workspace ? "updateWorkspace" : "createWorkspace"}
      formData={workspace ?? { title: "New Workspace", color: colors[0] }}
      params={{ pk: workspace?.id }}
      onSubmit={loadingWrapper(onSubmit)}
    >
      <Form.Row columnCount={1} rowGap="32px">
        <Input name="title" label="Workspace Name" labelProps={{ large: true }} />

        <RadioGroup name="color" label="Color" size="large" labelProps={{ size: "large" }}>
          {colors.map(color => (
            <RadioGroup.Button key={color} value={color}>
              <Block name="color" style={{ '--background': color }}/>
            </RadioGroup.Button>
          ))}
        </RadioGroup>
      </Form.Row>

      <Form.Actions extra={workspace && (
        empty
          ? <Button type="button" look="danger" waiting={loading} onClick={loadingWrapper(onDelete)}>Delete Workspace</Button>
          // @todo Tooltip doesn't work on disabled buttons
          : (
            <Tooltip title="Can’t delete non-empty workspaces">
              <Button type="button" className={disabledClassName}>Delete Workspace</Button>
            </Tooltip>
          )
      )}>
        <Button type="button" style={{ width: 90 }} onClick={onClose}>Cancel</Button>
        <Button type="submit" waiting={loading} look="primary" style={{ width: 90 }}>Save</Button>
      </Form.Actions>
    </Form>
  );
};
