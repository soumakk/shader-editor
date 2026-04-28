import Editor, { Monaco } from "@monaco-editor/react";
import { produce } from "immer";
import { Play } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  setupGLSLCompletionProvider,
  setupGLSLLanguage,
  setupGLSLSyntaxHighlighting,
} from "../../lib/glsl";
import { IFiles } from "../../lib/types";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import FileTab from "./FileTab";

export default function ShaderEditor({
  files,
  setFiles,
}: {
  files: IFiles;
  setFiles: Dispatch<SetStateAction<IFiles>>;
}) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const [fileName, setFileName] = useState<"vertex" | "fragment">("fragment");
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const [localFiles, setLocalFiles] = useState<IFiles>(files);
  const currentFile = localFiles[fileName];

  // Ref for Monaco's shortcut command so it always has the fresh state
  const localFilesRef = useRef(localFiles);
  useEffect(() => {
    localFilesRef.current = localFiles;
  }, [localFiles]);

  // Sync if external files change
  useEffect(() => {
    setLocalFiles(files);
  }, [files]);

  // Compile triggered by the UI button
  function handleCompile() {
    setFiles(localFiles);
  }

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;

    setupGLSLLanguage(monaco);
    setupGLSLSyntaxHighlighting(monaco);
    setupGLSLCompletionProvider(monaco);

    monaco.editor.defineTheme("shader-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "555555", fontStyle: "italic" },
        { token: "keyword", foreground: "C084FC" },
        { token: "type", foreground: "38BDF8" },
        { token: "number", foreground: "A3E635" },
        { token: "identifier.function", foreground: "FBBF24" },
        { token: "custom-builtin", foreground: "38BDF8" },
        { token: "operator", foreground: "94A3B8" },
        { token: "keyword.directive", foreground: "F472B6" }, // Hot Pink for #include
        { token: "string.include", foreground: "FDE047" },
      ],
      colors: {
        "editor.background": "#0D0F17",
        "editor.foreground": "#E2E8F0",
        "editor.lineHighlightBackground": "#1A1D27",
        "editorLineNumber.foreground": "#475569",
        "editorLineNumber.activeForeground": "#C084FC",
        "editorIndentGuide.background": "#1E2330",
        "editorSuggestWidget.background": "#0D0F17",
        "editorSuggestWidget.border": "#1A1D27",
        "editorSuggestWidget.selectedBackground": "#1A1D27",
      },
    });
    monaco.editor.setTheme("shader-theme");

    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPos({ line: e.position.lineNumber, col: e.position.column });
    });

    // Native Monaco Shortcut: Intercepts Ctrl+Enter / Cmd+Enter
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      setFiles(localFilesRef.current);
    });
  }

  function handleEditorChange(value?: string) {
    setLocalFiles(
      produce((draft: any) => {
        draft[fileName].value = value || "";
      }),
    );
  }

  return (
    <div className="flex flex-col h-full rounded-xl bg-background border border-border overflow-hidden mx-1">
      <div className="flex items-center justify-between  bg-background border-b border-border">
        <div className="flex gap-1">
          <FileTab
            isActive={fileName === "vertex"}
            onClick={() => setFileName("vertex")}
            title="vertex.glsl"
            icon="🔗"
          />
          <FileTab
            isActive={fileName === "fragment"}
            onClick={() => setFileName("fragment")}
            title="fragment.glsl"
            icon="✨"
            hasIndicator
          />
        </div>

        <div className="flex items-center gap-2 px-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    onClick={handleCompile}
                    className="flex items-center gap-1.5 bg-card hover:bg-popover text-white border border-border p-1.5 rounded-md active:scale-95 transition-all cursor-pointer"
                  >
                    <Play size={14} />
                  </button>
                }
              ></TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-popover text-slate-200 mt-2"
              >
                <p>Run code (Ctrl + Enter)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage={currentFile.language}
          path={currentFile.name}
          value={currentFile.value}
          theme="shader-theme"
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            automaticLayout: true,
            fontSize: 14,
            fontFamily: '"Fira Code", monospace',
            // wordWrap: "on",
            lineNumbers: "on",
            folding: true,
            bracketMatching: "always",
            scrollBeyondLastLine: false,
            padding: { top: 16 },
          }}
        />
      </div>

      {/*<div className="flex items-center justify-between px-4 py-2 bg-background border-t border-white/10 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span>
            Line {cursorPos.line}, Col {cursorPos.col}
          </span>
        </div>

        <div className="flex items-center"></div>
      </div>*/}
    </div>
  );
}
