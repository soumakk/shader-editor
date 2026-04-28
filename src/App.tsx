import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { useState } from "react";
import ShaderEditor from "./components/editor/ShaderEditor";
import UniformsPanel from "./components/panels/UniformPanel";
import ShaderPreview from "./components/preview/ShaderPreview";
import { initialFiles } from "./lib/defaultShader";
import { IFiles } from "./lib/types";
import { TooltipProvider } from "./ui/tooltip";
import { Toaster } from "react-hot-toast";

function App() {
  const [files, setFiles] = useState<IFiles>(initialFiles);

  return (
    <TooltipProvider>
      <div className="h-screen bg-dark p-2">
        <Allotment>
          <Allotment.Pane preferredSize={300}>
            <UniformsPanel />
          </Allotment.Pane>
          <Allotment.Pane minSize={500} preferredSize={700}>
            <div className="flex flex-col h-full gap-2">
              <div className="flex-1">
                <ShaderEditor files={files} setFiles={setFiles} />
              </div>
              {/*<ConsolePanel />*/}
            </div>
          </Allotment.Pane>
          <Allotment.Pane minSize={500}>
            <ShaderPreview
              fragmentShader={files["fragment"].value}
              vertexShader={files["vertex"].value}
            />
          </Allotment.Pane>
        </Allotment>
      </div>
      <Toaster position="bottom-right" />
    </TooltipProvider>
  );
}

export default App;
