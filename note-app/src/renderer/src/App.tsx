import { Content, RootLayout, Sidebar, DraggableTopBar, ActionButtonsRow, NotePreviewList, MarkdownEditor, FloatingNoteTitle } from "@/components"
import { useRef } from "react";


const App: React.FC = () => {
  const contentContainerRef = useRef<HTMLDivElement>(null);

  const resetScroll = () => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo(0, 0);
    }
  }

  return (
  <>
    <DraggableTopBar />
    <RootLayout>
      <Sidebar className="p-2" >
        <ActionButtonsRow className="flex justify-between mt-1" />
        <NotePreviewList className="mt-3 space-y-2" onSelect={resetScroll} />
      </Sidebar>
      <Content ref={contentContainerRef} className="p-2 border-l bg-zinc-800/50 border-l-white/10">
        <FloatingNoteTitle />
        <MarkdownEditor />
      </Content>
    </RootLayout>
  </>
  )
}

export default App
