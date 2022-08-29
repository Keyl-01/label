import { Userpic } from "../../components/Userpic/Userpic";
import { q } from "../../pages/ProjectDashboard/helpers";
import { BemWithSpecifiContext } from "../../utils/bem";
import { numberWithPrecision, userDisplayName } from "../../utils/helpers";
import "./AgreementTable.styl";

const { Block, Elem } = BemWithSpecifiContext();

export const AgreementTable = ({ title, scores, users }) => {
  return (
    <Block name="agreement-table">
      <Elem name="title">
        {title}
      </Elem>

      <Elem name="scores">
        {scores.map(({ user: userID, score }) => {
          const user = users.find(({ id }) => id === userID);
          const userName = userDisplayName(user);

          return (
            <Elem key={`score-${userID}`} name="agreement" mod={{ withScore: score !== null }}>
              <Elem name="user-info">
                <Userpic user={user} size={20}/>
                <Elem name="name">{userName}</Elem>
              </Elem>

              <Elem name="score" mod={{ [q(score)]: true }}>
                {score !== null ? numberWithPrecision(score * 100, 2, true) : '...'}
              </Elem>
            </Elem>
          );
        })}
      </Elem>
    </Block>
  );
};
