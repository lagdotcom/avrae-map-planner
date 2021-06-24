import React, { FC } from "react";
import { connect, ConnectedProps } from "react-redux";
import { AppState } from "./store";
import classnames from "classnames";

const mapStateToParams = (state: AppState) => ({
  plan: state.plan,
  show: state.ui.initPanel,
});
const connector = connect(mapStateToParams);
type Props = ConnectedProps<typeof connector>;

const InitPanel: FC<Props> = ({ plan, show }) => {
  return (
    <div className={classnames("Flyout", "InitPanel", { show })}>
      <table>
        <tbody>
          {plan.units
            .slice()
            .sort((a, b) => b.initiative - a.initiative)
            .map((u, i) => (
              <tr key={i}>
                <td className="Initiative">{u.initiative}</td>
                <td>{u.label}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default connector(InitPanel);
