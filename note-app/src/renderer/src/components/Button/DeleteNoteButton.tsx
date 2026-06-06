import React from "react";
import {ActionButton, ActionButtonProps} from "@/components";
import {FaRegTrashAlt} from "react-icons/fa"
import { deleteNoteAtom } from "@renderer/store";
import { useSetAtom } from "jotai";

export const DeleteNoteButton = ({...props}: ActionButtonProps) => {
    const deleteNote = useSetAtom(deleteNoteAtom);

    const handleDeletion = async () => {
       await deleteNote();
    }

    return (
        <ActionButton onClick={handleDeletion} {...props}>
            <FaRegTrashAlt className="w-4 h-4 text-zinc-300" />
        </ActionButton>
    )
}  