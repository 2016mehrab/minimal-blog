import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Bold,
  Italic,
  Undo,
  Redo,
  List,
  ListOrdered,
  ChevronDown,
  Code,
  SubscriptIcon,
  SuperscriptIcon,
  UnderlineIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  SeparatorHorizontalIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  Link2Icon,
  QuoteIcon,
  HighlighterIcon,
} from "lucide-react";
import { Button } from "./ui/button";

const TextEditorMenu = ({ editor }) => {
  const setLink = () => {
    const previousUrl = editor?.getAttributes("link").href || "";
    const url = window.prompt("Enter the URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    try {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e) {
      console.error(`Error setting link: ${e.message}`);
    }
  };

  function getHeadingButtonText() {
    if (!editor) return "Heading";
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    return "Paragraph";
  }

  const handleHeadingSelect = (level) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  };

  const getActiveButtonClasses = (isActive) => {
    return isActive
      ? "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
      : "";
  };

  return (
    <div className="bg-muted p-2 md:p-4 rounded-md flex gap-2 md:gap-3 flex-wrap items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={
              editor &&
              (editor.isActive("heading", { level: 1 }) ||
                editor.isActive("heading", { level: 2 }) ||
                editor.isActive("heading", { level: 3 }) ||
                (!editor.isActive("heading") && editor.isActive("paragraph")))
                ? getActiveButtonClasses(true)
                : ""
            }
          >
            {getHeadingButtonText()} <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="bg-popover text-popover-foreground border-border"
        >
          <DropdownMenuItem
            onSelect={() => handleHeadingSelect(1)}
            className={`justify-center ${getActiveButtonClasses(editor?.isActive("heading", { level: 1 }))}`}
          >
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleHeadingSelect(2)}
            className={`justify-center ${getActiveButtonClasses(editor?.isActive("heading", { level: 2 }))}`}
          >
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleHeadingSelect(3)}
            className={`justify-center ${getActiveButtonClasses(editor?.isActive("heading", { level: 3 }))}`}
          >
            Heading 3
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => editor?.chain().focus().setParagraph().run()}
            className={`justify-center ${getActiveButtonClasses(
              editor &&
              !editor.isActive("heading") &&
              editor.isActive("paragraph")
            )}`}
          >
            Paragraph
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant={"outline"}
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().toggleBold().run()}
        className={getActiveButtonClasses(editor?.isActive("bold"))}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        className={getActiveButtonClasses(editor?.isActive("italic"))}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
        className={getActiveButtonClasses(editor?.isActive("underline"))}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        type="button"
        onClick={setLink}
        className={getActiveButtonClasses(editor?.isActive("link"))}
      >
        <Link2Icon className="h-4 w-4" />
      </Button>

      <div className="h-6 w-px bg-border mx-1 md:mx-2" />
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().toggleSubscript().run()}
        className={getActiveButtonClasses(editor?.isActive("subscript"))}
      >
        <SubscriptIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().toggleSuperscript().run()}
        className={getActiveButtonClasses(editor?.isActive("superscript"))}
      >
        <SuperscriptIcon className="h-4 w-4" />
      </Button>

      <div className="h-6 w-px bg-border mx-1 md:mx-2" />
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().setTextAlign("left").run()}
        className={getActiveButtonClasses(editor?.isActive({ textAlign: "left" }))}
      >
        <AlignLeftIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        type="button"
        onClick={() => editor?.chain().focus().setTextAlign("center").run()}
        className={getActiveButtonClasses(editor?.isActive({ textAlign: "center" }))}
      >
        <AlignCenterIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().setTextAlign("right").run()}
        className={getActiveButtonClasses(editor?.isActive({ textAlign: "right" }))}
      >
        <AlignRightIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
        className={getActiveButtonClasses(editor?.isActive({ textAlign: "justify" }))}
      >
        <AlignJustifyIcon className="h-4 w-4" />
      </Button>

      <div className="h-6 w-px bg-border mx-1 md:mx-2" />
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        className={getActiveButtonClasses(editor?.isActive("bulletList"))}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        type="button"
        className={getActiveButtonClasses(editor?.isActive("orderedList"))}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <div className="h-6 w-px bg-border mx-1 md:mx-2" />
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        type="button"
        className={getActiveButtonClasses(editor?.isActive("blockquote"))}
      >
        <QuoteIcon className="h-4 w-4" />
      </Button>
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        type="button"
        className={getActiveButtonClasses(editor?.isActive("highlight"))}
      >
        <HighlighterIcon className="h-4 w-4" />
      </Button>

      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        type="button"
        className={getActiveButtonClasses(editor?.isActive("codeBlock"))}
      >
        <Code className="h-4 w-4" />
      </Button>
      <div className="h-6 w-px bg-border mx-1 md:mx-2" />

      <Button
        variant={"outline"}
        size={"icon"}
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={""}
      >
        <SeparatorHorizontalIcon className="h-4 w-4" />
      </Button>
      <div className="h-6 w-px bg-border mx-1 md:mx-2" />
      <Button
        variant="outline"
        size="icon"
        type="button"
        onClick={() => editor?.chain().focus().undo().run()}
        disabled={!editor?.can().undo()}
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        type="button"
        onClick={() => editor?.chain().focus().redo().run()}
        disabled={!editor?.can().redo()}
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TextEditorMenu;