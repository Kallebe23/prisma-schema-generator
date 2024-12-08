import { CodeViewer } from "@/components/code-viewer";
import SchemaDiagram from "@/components/diagram";

export default function Home() {
  return (
    <main className="min-h-screen flex">
      <SchemaDiagram />
      <CodeViewer />
    </main>
  );
}
