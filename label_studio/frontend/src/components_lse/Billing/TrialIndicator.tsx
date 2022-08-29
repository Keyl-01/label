import { CSSProperties, FC, useCallback, useEffect, useState } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { ABILITY } from '../../config/PermissionsConfig';
import { useAPI } from '../../providers/ApiProvider';
import { RestrictedAccess } from '../../providers/PermissionProvider';
import { BemComponent, Block } from "../../utils/bem";
import { isDefined } from '../../utils/helpers';
import "./TrialIndicator.styl";

interface TrialProps {
  start?: Date,
  end?: Date,
  message?: string,
  small?: boolean,
  onClick?: (e: MouseEvent) => void
  style?: CSSProperties
}

let trial: {
  active: boolean,
  left: number,
} | undefined;

export const TrialIndicatorInner: FC<TrialProps> = ({
  message,
  onClick,
  small = false,
  style,
}) => {
  const api = useAPI();
  const [daysLeft, setDaysLeft] = useState(0);
  const [expired, setExpired] = useState(false);
  const [active, setActive] = useState(message ? true : false);
  const isEnterprise = APP_SETTINGS.billing?.enterprise === true;

  const setTrial = useCallback(() => {
    if (isDefined(trial)) {
      const trialLeft = trial.left;
      const trialExpired = trialLeft <= 0;

      setDaysLeft(trialLeft);
      setExpired(trialLeft <= 0);
      setActive(!trialExpired || trial.active);
    }
  }, []);

  const fetchTrial = useCallback(async () => {
    const info: any = await api.callApi("billingInfo");
    const { subscription, billing_checks: checks, billing_flags: flags } = info;

    if (subscription || isDefined(flags.activated_at)) {
      trial = {
        left: checks?.trial_days,
        active: ['active', 'trialing'].includes(subscription?.status) || flags.activated_at !== null,
      };

      setTrial();
    }
  }, []);

  useEffect(() => {
    if (!isEnterprise && !isDefined(message)) {
      if (isDefined(trial)) {
        setTrial();
      } else {
        fetchTrial();
      }
    }
  }, []);

  const attrs: Partial<LinkProps> & Partial<BemComponent> = (trial && !message && !isEnterprise) ? {
    tag: Link,
    to: '/billing',
    'data-external': true,
  } : {};

  if (isEnterprise || (expired && active)) {
    return null;
  }

  return (message || trial) ? (
    <Block
      name="trial"
      style={style}
      mod={{
        expired: expired || active === false,
        small,
        clickable: !!onClick,
      }}
      {...attrs}
    >
      {message ?? (active === false ? (
        "Plan is inactive"
      ) : expired ? (
        "Your trial period has expired"
      ) : (
        `${daysLeft} days of trial left`
      ))}
    </Block>
  ) : null;
};

export const TrialIndicator: FC<TrialProps> = (props) => {
  return (
    <RestrictedAccess ability={ABILITY.can_manage_billing}>
      <TrialIndicatorInner {...props} />
    </RestrictedAccess>
  );
};
