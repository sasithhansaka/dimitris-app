import { cn } from "@/lib/utils";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Redo,
    Strikethrough,
    Undo,
} from "lucide-react";

function ToolbarButton({
    onClick,
    active,
    disabled,
    title,
    children,
}: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            title={title}
            disabled={disabled}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
            className={cn(
                "inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
                active && "bg-accent text-accent-foreground",
            )}
        >
            {children}
        </button>
    );
}

export function RichTextEditor({
    id,
    value,
    onChange,
    placeholder,
    className,
}: {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        editorProps: {
            attributes: {
                id: id ?? "",
                class: "max-w-none text-sm focus:outline-none h-[70vh] max-h-[200px] overflow-y-auto px-3 py-2 text-foreground [&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold",
                ...(placeholder ? { "data-placeholder": placeholder } : {}),
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div
            className={cn(
                "border-input focus-within:border-ring focus-within:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] focus-within:ring-[3px]",
                className,
            )}
        >
            <div className="flex flex-wrap items-center gap-1 border-b border-border p-1">
                <ToolbarButton
                    title="Bold"
                    active={editor.isActive("bold")}
                    onClick={() =>
                        editor.chain().focus().toggleBold().run()
                    }
                >
                    <Bold className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Italic"
                    active={editor.isActive("italic")}
                    onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                    }
                >
                    <Italic className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Strikethrough"
                    active={editor.isActive("strike")}
                    onClick={() =>
                        editor.chain().focus().toggleStrike().run()
                    }
                >
                    <Strikethrough className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Bullet list"
                    active={editor.isActive("bulletList")}
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                >
                    <List className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Numbered list"
                    active={editor.isActive("orderedList")}
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                >
                    <ListOrdered className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Undo"
                    disabled={!editor.can().undo()}
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    <Undo className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Redo"
                    disabled={!editor.can().redo()}
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    <Redo className="size-4" />
                </ToolbarButton>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
