import { markdownShortcutPlugin, codeBlockPlugin, headingsPlugin, imagePlugin, linkPlugin,  listsPlugin, MDXEditor, quotePlugin, } from '@mdxeditor/editor'
import { useMarkdownEditor } from '@renderer/hooks/useMarkdownEditor';
import React from 'react'

export const MarkdownEditor = () => {
  const { selectedNote, editorRef, handleAutoSaving, handleBlur } = useMarkdownEditor();
  
  if (!selectedNote) {
    return (
      <div className="text-sm text-center text-zinc-500 mt-5"> 
          What will it be, boss?
      </div>
    )
  }

  return (
    <MDXEditor 
      ref={editorRef}
      key={selectedNote.title}
      markdown={selectedNote.content}
      onChange={handleAutoSaving}
      onBlur={handleBlur}
      plugins={[headingsPlugin(), listsPlugin(), quotePlugin(), linkPlugin(), imagePlugin(), codeBlockPlugin(), markdownShortcutPlugin()]}
      contentEditableClassName="outline-none min-h-screen max-w-none text-lg px-8 py-5 caret-yellow-500 prose prose-invert prose-p:my-3 prose-p:leading-relaced prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:py-1 prose-code:text-red-500 prose-code:before:content-[''] prose-code:after:content-['']" />
  )
}
