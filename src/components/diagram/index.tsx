import ModelFormDialog from "./add-model-dialog";
import FlowChart from "./flow-chart";

export default function Diagram() {
  return (
    <div className="flex-1 relative">
      <FlowChart />
      <ModelFormDialog />
    </div>
  );
}
