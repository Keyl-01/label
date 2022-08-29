import { useEffect, useMemo, useRef } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Userpic } from "../../components/Userpic/Userpic";
import { Block, cn, Elem } from "../../utils/bem";
import "./UserInfo.styl";

const UserInfo = ({ anchor, user, contents, unmount }) => {
  const position = useMemo(() => {
    const offsets = anchor.getBoundingClientRect();

    return {
      top: offsets.top,
      left: offsets.left,
    };
  }, [anchor]);

  const popover = useRef();

  const userName = useMemo(() => {
    if (user.firstName || user.lastName) {
      return [user.firstName, user.lastName].filter(n => !!n).join(" ").trim();
    } else if (user.username) {
      return user.username;
    }
  }, [user]);

  const hidePopover = (e) => {
    const { target } = e;

    const anchorClicked = anchor === target || anchor.contains(target);
    const clickedOutside = !popover.current.contains(target) && popover.current !== target;

    if (!anchorClicked && clickedOutside) {
      e.preventDefault();
      e.stopPropagation();
      unmount();
    }
  };

  useEffect(() => {
    const clickHandler = (e) => {
      hidePopover(e);
    };

    const scrollHandler = () => {
      unmount();
    };

    const removeHandlers = () => {
      document.removeEventListener('click', clickHandler, { capture: true });
      window.removeEventListener('scroll', scrollHandler, { capture: true });
    };

    removeHandlers();

    document.addEventListener('click', clickHandler, { capture: true });
    window.addEventListener('scroll', scrollHandler, { capture: true });

    return removeHandlers;
  }, []);

  return (
    <Block ref={popover} name="user-info-popover" style={position}>
      <Elem name="header">
        <Userpic user={user}/>

        <Elem name="user-info">
          {userName && (<Elem name="name">{userName}</Elem>)}
          {user.email && (<Elem name="email">{user.email}</Elem>)}
        </Elem>
      </Elem>
      {contents && (
        <Elem name="content">
          {contents}
        </Elem>
      )}
    </Block>
  );
};

export const showUserInfo = ({
  anchor,
  user,
  contents,
}) => {
  const className = cn('user-info-holder');
  const root = className.select() ?? document.createElement('div');

  root.className = className.toClassName();

  if (!root.parentNode) {
    document.body.appendChild(root);
  }

  const unmount = () => {
    unmountComponentAtNode(root);
    root.remove();
  };

  render((
    <UserInfo
      anchor={anchor}
      user={user}
      contents={contents}
      unmount={unmount}
    />
  ), root);

  return unmount;
};
