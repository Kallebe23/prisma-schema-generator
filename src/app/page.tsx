import { CodeViewer } from "@/components/code-viewer";
import SchemaDiagram from "@/components/diagram";
import { ReactFlowProvider } from "@xyflow/react";

export default function Home() {
  return (
    <main className="min-h-screen flex">
      <ReactFlowProvider>
        <SchemaDiagram />
        <CodeViewer />
      </ReactFlowProvider>
    </main>
  );
}
