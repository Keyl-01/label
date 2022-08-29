import React from "react";
import { Userpic } from "../../components/Userpic/Userpic";
import { Block, Elem } from "../../utils/bem";
import "./Userpics.styl";

export const Userpics = ({
  users,
  overlay = false,
  overlayColor = "#fff",
  max = 6,
  useRandomBackground = false,
  showUsername,
}) => {
  const tooMuch = users.length > max;
  const borderStyle = overlay ? {
    borderColor: overlayColor,
  } : {};

  return (
    <Block name="userpics" mod={{ overlay }}>
      {tooMuch && (
        <Elem name="userpic" style={borderStyle}>
          <Userpic addCount={ `+${users.length - max + 1}` } />
        </Elem>
      )}
      {users.reverse().slice(0, tooMuch ? max - 1 : max).map(user => (
        <Elem key={user.id} name="userpic" style={borderStyle}>
          <Userpic
            user={user}
            showUsername={showUsername}
            useRandomBackground={useRandomBackground}
          />
        </Elem>
      ))}
    </Block>
  );
};
