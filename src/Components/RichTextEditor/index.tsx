import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    ListTodo,
    Quote,
    Link as LinkIcon,
    Minus,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Highlighter,
    Undo,
    Redo,
    RemoveFormatting,
    Palette,
} from 'lucide-react';
import { Button } from '../Button';
import { useState, useCallback } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    content,
    onChange,
    placeholder = 'Write your post content here...',
    disabled = false,
}) => {
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [showColorPicker, setShowColorPicker] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Highlight.configure({
                multicolor: true,
            }),
            TextStyle,
            Color,
        ],
        content,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    const setLink = useCallback(() => {
        if (!editor) return;

        if (linkUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            setShowLinkInput(false);
            return;
        }

        const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        setShowLinkInput(false);
        setLinkUrl('');
    }, [editor, linkUrl]);

    const setColor = useCallback(
        (color: string) => {
            if (!editor) return;
            editor.chain().focus().setColor(color).run();
            setShowColorPicker(false);
        },
        [editor]
    );

    if (!editor) {
        return null;
    }

    const colors = [
        '#000000', '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
        '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
        '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
    ];

    return (
        <div className="border border-input rounded-md overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-input bg-muted/20">
                {/* Text Formatting */}
                <div className="flex gap-0.5 pr-1.5 border-r border-input/50">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={!editor.can().chain().focus().toggleBold().run() || disabled}
                        className={`h-10 w-10 p-0 ${editor.isActive('bold') ? 'bg-muted' : ''}`}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="w-6 h-6" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={!editor.can().chain().focus().toggleItalic().run() || disabled}
                        className={`h-10 w-10 p-0 ${editor.isActive('italic') ? 'bg-muted' : ''}`}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="w-6 h-6" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        disabled={disabled}
                        className={`h-10 w-10 p-0 ${editor.isActive('underline') ? 'bg-muted' : ''}`}
                        title="Underline (Ctrl+U)"
                    >
                        <UnderlineIcon className="w-6 h-6" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        disabled={disabled}
                        className={`h-10 w-10 p-0 ${editor.isActive('strike') ? 'bg-muted' : ''}`}
                        title="Strikethrough"
                    >
                        <Strikethrough className="w-6 h-6" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        disabled={disabled}
                        className={`h-10 w-10 p-0 ${editor.isActive('code') ? 'bg-muted' : ''}`}
                        title="Inline Code"
                    >
                        <Code className="w-6 h-6" />
                    </Button>
                </div>

                {/* Headings */}
                <div className="flex gap-0.5 pr-1.5 border-r border-input/50">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        disabled={disabled}
                        className={`h-10 w-10 p-0 ${editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}`}
                        title="Heading 1"
                    >
                        <Heading1 className="w-6 h-6" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        disabled={disabled}
                        className={`h-10 w-10 p-0 ${editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}`}
                        title="Heading 2"
                    >
                        <Heading2 className="w-6 h-6" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        disabled={disabled}
                        className={`h-10 w-10 p-0 ${editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}`}
                        title="Heading 3"
                    >
                        <Heading3 className="w-6 h-6" />
                    </Button>
                </div>

                {/* Lists */}
                <div className="flex gap-0.5 pr-1.5 border-r border-input/50">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        disabled={disabled}
                        className={`h-10 w-10 p-0 ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}
                        title="Bullet List"
                    >
                        <List className="w-6 h-6" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        disabled={disabled}
                        className={`h-10 w-10 p-0 ${editor.isActive('orderedList') ? 'bg-muted' : ''}`}
                        title="Numbered List"
                    >
                        <ListOrdered className="w-6 h-6" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                        disabled={disabled}
                        className={`h-10 w-10 p-0 ${editor.isActive('taskList') ? 'bg-muted' : ''}`}
                        title="Task List"
                    >
                        <ListTodo className="w-6 h-6" />
                    </Button>
                </div>

                {/* Alignment */}
                <div className="flex gap-0.5 pr-1.5 border-r border-input/50">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        disabled={disabled}
                        className={`h-10 w-10 p-0 ${editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}`}
                        title="Align Left"
                    >
                        <AlignLeft className="w-6 h-6" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        disabled={disabled}
                        className={`h-10 w-10 p-0 ${editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}`}
                        title="Align Center"
                    >
                        <AlignCenter className="w-6 h-6" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        disabled={disabled}
                        className={`h-10 w-10 p-0 ${editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}`}
                        title="Align Right"
                    >
                        <AlignRight className="w-6 h-6" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        disabled={disabled}
                        className={`h-10 w-10 p-0 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-muted' : ''}`}
                        title="Justify"
                    >
                        <AlignJustify className="w-6 h-6" />
                    </Button>
                </div>

                {/* Other Formatting */}
                <div className="flex gap-0.5 pr-1.5 border-r border-input/50">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        disabled={disabled}
                        className={`h-10 w-10 p-0 ${editor.isActive('blockquote') ? 'bg-muted' : ''}`}
                        title="Blockquote"
                    >
                        <Quote className="w-6 h-6" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        disabled={disabled}
                        className="h-10 w-10 p-0"
                        title="Horizontal Rule"
                    >
                        <Minus className="w-6 h-6" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        disabled={disabled}
                        className={`h-10 w-10 p-0 ${editor.isActive('highlight') ? 'bg-muted' : ''}`}
                        title="Highlight"
                    >
                        <Highlighter className="w-6 h-6" />
                    </Button>
                </div>

                {/* Link & Color */}
                <div className="flex gap-0.5 pr-1.5 border-r border-input/50">
                    <div className="relative">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowLinkInput(!showLinkInput)}
                            disabled={disabled}
                            className={`h-10 w-10 p-0 ${editor.isActive('link') ? 'bg-muted' : ''}`}
                            title="Add Link"
                        >
                            <LinkIcon className="w-6 h-6" />
                        </Button>
                        {showLinkInput && (
                            <div className="absolute top-full left-0 mt-1 p-2 bg-card border border-input rounded-md shadow-lg z-10 flex gap-2 min-w-[280px]">
                                <input
                                    type="text"
                                    placeholder="https://example.com"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && setLink()}
                                    className="flex-1 px-2 py-1 text-sm border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                                    autoFocus
                                />
                                <Button type="button" size="sm" onClick={setLink} className="h-7">
                                    Set
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            disabled={disabled}
                            className="h-10 w-10 p-0"
                            title="Text Color"
                        >
                            <Palette className="w-6 h-6" />
                        </Button>
                        {showColorPicker && (
                            <div className="absolute top-full left-0 mt-1 p-2 bg-card border border-input rounded-md shadow-lg z-10">
                                <div className="grid grid-cols-6 gap-1 w-40">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setColor(color)}
                                            className="w-6 h-6 rounded border border-input hover:scale-110 transition-transform"
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Clear Formatting */}
                <div className="flex gap-0.5 pr-1.5 border-r border-input/50">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                        disabled={disabled}
                        className="h-10 w-10 p-0"
                        title="Clear Formatting"
                    >
                        <RemoveFormatting className="w-6 h-6" />
                    </Button>
                </div>

                {/* Spacer */}
                <div className="flex-1 min-w-[8px]" />

                {/* Undo/Redo */}
                <div className="flex gap-0.5">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run() || disabled}
                        className="h-10 w-10 p-0"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="w-6 h-6" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run() || disabled}
                        className="h-10 w-10 p-0"
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo className="w-6 h-6" />
                    </Button>
                </div>
            </div>

            {/* Editor Content */}
            <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none 
          [&_.ProseMirror]:outline-none 
          [&_.ProseMirror]:min-h-[300px]
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground 
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] 
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left 
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none
          [&_.ProseMirror_ul[data-type='taskList']]:list-none
          [&_.ProseMirror_ul[data-type='taskList']_li]:flex
          [&_.ProseMirror_ul[data-type='taskList']_li>label]:flex-none
          [&_.ProseMirror_ul[data-type='taskList']_li>div]:flex-1
          [&_.ProseMirror_ul[data-type='taskList']_li>label>input]:mr-2
          [&_.ProseMirror_h1]:text-3xl
          [&_.ProseMirror_h1]:font-bold
          [&_.ProseMirror_h1]:mt-6
          [&_.ProseMirror_h1]:mb-4
          [&_.ProseMirror_h2]:text-2xl
          [&_.ProseMirror_h2]:font-bold
          [&_.ProseMirror_h2]:mt-5
          [&_.ProseMirror_h2]:mb-3
          [&_.ProseMirror_h3]:text-xl
          [&_.ProseMirror_h3]:font-bold
          [&_.ProseMirror_h3]:mt-4
          [&_.ProseMirror_h3]:mb-2
          [&_.ProseMirror_blockquote]:border-l-4
          [&_.ProseMirror_blockquote]:border-muted
          [&_.ProseMirror_blockquote]:pl-4
          [&_.ProseMirror_blockquote]:italic
          [&_.ProseMirror_code]:bg-muted
          [&_.ProseMirror_code]:px-1
          [&_.ProseMirror_code]:rounded
          [&_.ProseMirror_code]:text-sm
          [&_.ProseMirror_hr]:my-4
          [&_.ProseMirror_hr]:border-t-2
          [&_.ProseMirror_hr]:border-muted
          [&_.ProseMirror_mark]:bg-yellow-200
          [&_.ProseMirror_mark]:dark:bg-yellow-900"
            />
        </div>
    );
};
