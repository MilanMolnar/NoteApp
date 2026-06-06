import { ComponentProps } from 'react';
import { NotePreview } from '@/components/NotePreview';
import { useNotesList } from '@renderer/hooks/useNotesList';
import { isEmpty } from 'lodash';

export type NotePreviewListProps = ComponentProps<'ul'> & {
    onSelect?: () => void;
}

export const NotePreviewList = ({className, onSelect, ...props}: NotePreviewListProps) => {
  const {notes, selectedNoteIndex, handleNoteSelect} = useNotesList({ onSelect });
  
  if (!notes) return null;

  if (isEmpty(notes)) {
      return (
          <div className="text-sm text-center text-zinc-500 mt-5"> 
              Only the best notes here! 
          </div>
      )
  }

  return (
    <ul {...props}>
      {notes.map((note, index) => (
          <NotePreview key={note.title + note.lastEditTime}
          isActive={selectedNoteIndex ===index}
          onClick={handleNoteSelect(index)}
          {...note} />
      ))}
    </ul>
  );        
};