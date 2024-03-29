import classnames from "classnames";
import { ChangeEvent, useCallback, useEffect, useRef } from "react";
import { connect, ConnectedProps } from "react-redux";

import { AppState } from "./store";
import { patchPlan } from "./store/plan";
import { closeAllPanels } from "./store/ui";
import { convertFromUVar } from "./tools";

const mapStateToProps = (state: AppState) => ({
  show: state.ui.loadPanel,
});
const mapDispatchToProps = { closeAllPanels, patchPlan };
const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

function LoadPanel({ closeAllPanels, patchPlan, show }: Props) {
  const boxRef = useRef<HTMLTextAreaElement>(null);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const s = e.target.value;
      try {
        const stripped = s.startsWith("!uvar Battles ") ? s.substr(14) : s;
        const plan = convertFromUVar(stripped);
        patchPlan({
          ...plan,
          units: plan.units.map((u) => ({
            ...u,
            initiative: 0,
          })),
        });
        closeAllPanels();

        if (boxRef.current) boxRef.current.value = "";
      } catch (err) {
        alert(err);
      }
    },
    [closeAllPanels, patchPlan]
  );

  useEffect(() => {
    const box = boxRef.current;
    if (box && show) box.focus();
  }, [show]);

  return (
    <div className={classnames("LoadPanel", "Flyout", { show })}>
      <textarea rows={10} cols={20} ref={boxRef} onChange={onChange} />
    </div>
  );
}
export default connector(LoadPanel);
