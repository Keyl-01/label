import { cn } from '../../utils/bem';
import './Features.styl';
// import { default as IconCheckFilled } from './icons/check-filled.svg';
// import { default as IconCheckOutlined } from './icons/check-outlined.svg';
// import { default as IconStarOutlined } from './icons/star-outlined.svg';


// const ICONS = {
//   available: <IconCheckFilled/>,
//   upgrade: <IconStarOutlined />,
//   included: <IconCheckOutlined/>,
// };

export const Features = ({
  data = {},
  mod = 'owned',
}) => {
  const rootClass = cn().block('features');

  return (
    <ul className={rootClass.toClassName()}>
      {Object.entries(data).map(([key, value]) => {
        // const icon = ICONS[value] ?? ICONS.available;

        return (
          <li key={key}>
            {icon}
            {key}
          </li>
        );
      })}
    </ul>
  );
};
