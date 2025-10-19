'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Code,
  Undo,
  Redo,
  UnderlineIcon,
  Strikethrough,
  Quote,
  Minus,
  Palette,
  Highlighter,
  Type,
  Variable,
  ExternalLink,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function TiptapEditor({ content, onChange, placeholder = 'Start writing your email content...' }: TiptapEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-green-600 underline hover:text-green-700',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[350px] focus:outline-none p-4 border-none outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      
      // Update word and character count
      const text = editor.getText();
      setCharCount(text.length);
      setWordCount(text.split(/\s+/).filter(word => word.length > 0).length);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      if (linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run();
      }
      setLinkUrl('');
      setLinkText('');
      setShowLinkInput(false);
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertVariable = (variable: string) => {
    editor.chain().focus().insertContent(`{{${variable}}}`).run();
  };

  const insertCTAButton = () => {
    const buttonText = window.prompt('Enter button text:', 'Click Here');
    const buttonUrl = window.prompt('Enter button URL:', 'https://');
    
    if (buttonText && buttonUrl) {
      const buttonHTML = `<a href="${buttonUrl}" style="display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; font-weight: 600;">${buttonText}</a>`;
      editor.chain().focus().insertContent(buttonHTML).run();
    }
  };

  return (
    <div className="border rounded-lg bg-white">
      {/* Enhanced Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gradient-to-r from-gray-50 to-gray-100">
        {/* Text Formatting */}
        <div className="flex items-center gap-0.5">
          <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()} title="Bold">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()} title="Italic">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('underline')} onPressedChange={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
            <UnderlineIcon className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
            <Strikethrough className="h-4 w-4" />
          </Toggle>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Headings */}
        <div className="flex items-center gap-0.5">
          <Toggle size="sm" pressed={editor.isActive('heading', { level: 2 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
            <Heading2 className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('heading', { level: 3 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
            <Heading3 className="h-4 w-4" />
          </Toggle>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" title="Text Color">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Text Color</Label>
              <div className="grid grid-cols-6 gap-2">
                {['#000000', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'].map(color => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => editor.chain().focus().setColor(color).run()}
                    title={color}
                  />
                ))}
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => editor.chain().focus().unsetColor().run()}>
                Reset Color
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Highlight */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" title="Highlight">
              <Highlighter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Highlight Color</Label>
              <div className="grid grid-cols-6 gap-2">
                {['#fef08a', '#bfdbfe', '#d9f99d', '#fecaca', '#e9d5ff', '#fed7aa'].map(color => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => editor.chain().focus().setHighlight({ color }).run()}
                    title={color}
                  />
                ))}
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => editor.chain().focus().unsetHighlight().run()}>
                Remove Highlight
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <div className="flex items-center gap-0.5">
          <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered List">
            <ListOrdered className="h-4 w-4" />
          </Toggle>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Alignment */}
        <div className="flex items-center gap-0.5">
          <Toggle size="sm" pressed={editor.isActive({ textAlign: 'left' })} onPressedChange={() => editor.chain().focus().setTextAlign('left').run()} title="Align Left">
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive({ textAlign: 'center' })} onPressedChange={() => editor.chain().focus().setTextAlign('center').run()} title="Align Center">
            <AlignCenter className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive({ textAlign: 'right' })} onPressedChange={() => editor.chain().focus().setTextAlign('right').run()} title="Align Right">
            <AlignRight className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive({ textAlign: 'justify' })} onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()} title="Justify">
            <AlignJustify className="h-4 w-4" />
          </Toggle>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Quote & HR */}
        <div className="flex items-center gap-0.5">
          <Toggle size="sm" pressed={editor.isActive('blockquote')} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">
            <Quote className="h-4 w-4" />
          </Toggle>
          <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Insert Variable */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" title="Insert Variable">
              <Variable className="h-4 w-4 mr-1" />
              <span className="text-xs">Variable</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Insert Variable</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => insertVariable('firstName')}>
              {'{{firstName}}'} - First Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertVariable('lastName')}>
              {'{{lastName}}'} - Last Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertVariable('city')}>
              {'{{city}}'} - City
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertVariable('referralCode')}>
              {'{{referralCode}}'} - Referral Code
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* CTA Button */}
        <Button variant="ghost" size="sm" onClick={insertCTAButton} title="Insert CTA Button" className="text-xs">
          <ExternalLink className="h-4 w-4 mr-1" />
          CTA
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Link */}
        <Button variant="ghost" size="sm" onClick={() => setShowLinkInput(!showLinkInput)} title="Add Link">
          <LinkIcon className="h-4 w-4" />
        </Button>

        {/* Image */}
        <Button variant="ghost" size="sm" onClick={addImage} title="Insert Image">
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="p-3 border-b bg-blue-50/50 space-y-2">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-blue-600" />
            <Label className="text-sm font-semibold">Add Link</Label>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Link text (optional)"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="h-9 text-sm"
            />
            <Input
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addLink();
                }
              }}
              className="h-9 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={addLink} className="bg-green-600 hover:bg-green-700">
              Add Link
            </Button>
            {editor.isActive('link') && (
              <Button size="sm" variant="destructive" onClick={removeLink}>
                Remove Link
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => {
              setShowLinkInput(false);
              setLinkUrl('');
              setLinkText('');
            }}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Editor */}
      <EditorContent editor={editor} className="bg-white" />

      {/* Footer with Stats and Help */}
      <div className="flex items-center justify-between px-4 py-2 border-t bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="font-medium">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
          <span>•</span>
          <span className="font-medium">
            {charCount} {charCount === 1 ? 'character' : 'characters'}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="hidden sm:inline">
            💡 Use <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Ctrl+B</kbd> for bold, <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Ctrl+I</kbd> for italic
          </span>
        </div>
      </div>
    </div>
  );
}

