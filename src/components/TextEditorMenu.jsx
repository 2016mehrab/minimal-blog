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
      alert(`Error setting link: ${e.message}`);
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

  return (
    <div className=" bg-muted p-2 md:p-4 rounded-md  flex gap-2 md:gap-3 flex-wrap items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={
              editor &&
              (editor.isActive("heading", { level: 1 }) ||
                editor.isActive("heading", { level: 2 }) ||
                editor.isActive("heading", { level: 3 }))
                ? "bg-accent text-accent-foreground"
                : ""
            }
          >
            {getHeadingButtonText()} <ChevronDown className="ml-1 h-4 w-4" />
          </Button>

        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className={"outline-1 outline-red-400 "}
        >
          <DropdownMenuItem
            onSelect={() => handleHeadingSelect(1)}
            className={`justify-center  ${
              editor?.isActive("heading", { level: 1 })
                ? "bg-accent text-accent-background"
                : ""
            } `}
          >
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleHeadingSelect(2)}
            className={`justify-center  ${
              editor?.isActive("heading", { level: 2 })
                ? "bg-accent text-accent-background"
                : ""
            } `}
          >
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleHeadingSelect(3)}
            className={`justify-center  ${
              editor?.isActive("heading", { level: 3 })
                ? "bg-accent text-accent-background"
                : ""
            } `}
          >
            Heading 3
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => editor?.chain().focus().setParagraph().run()}
            className={`justify-center ${
              editor &&
              !editor.isActive("heading") &&
              editor.isActive("paragraph")
                ? "bg-accent text-accent-background"
                : ""
            }`}
          >
            Paragraph
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().toggleBold().run()}
        className={
          editor?.isActive("bold") ? "bg-accent text-accent-foreground" : ""
        }
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        className={
          editor?.isActive("italic") ? "bg-accent text-accent-foreground" : ""
        }
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
        className={
          editor?.isActive("underline")
            ? "bg-accent text-accent-foreground"
            : ""
        }
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        type="button"
        onClick={setLink}
        className={
          editor?.isActive("link") ? "bg-accent text-accent-foreground" : ""
        }
      >
        <Link2Icon className="h-4 w-4" />
      </Button>

      <div className="h-6 w-px bg-border mx-1 md:mx-2" />
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().toggleSubscript().run()}
        className={
          editor?.isActive("subscript")
            ? "bg-accent text-accent-foreground"
            : ""
        }
      >
        <SubscriptIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().toggleSuperscript().run()}
        className={
          editor?.isActive("superscript")
            ? "bg-accent text-accent-foreground"
            : ""
        }
      >
        <SuperscriptIcon className="h-4 w-4" />
      </Button>

      <div className="h-6 w-px bg-border mx-1 md:mx-2" />
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().setTextAlign("left").run()}
        className={
          editor?.isActive({ textAlign: "left" })
            ? "bg-accent text-accent-foreground"
            : ""
        }
      >
        <AlignLeftIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        type="button"
        onClick={() => editor?.chain().focus().setTextAlign("center").run()}
        className={
          editor?.isActive({ textAlign: "center" })
            ? "bg-accent text-accent-foreground"
            : ""
        }
      >
        <AlignCenterIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().setTextAlign("right").run()}
        className={
          editor?.isActive({ textAlign: "right" })
            ? "bg-accent text-accent-foreground"
            : ""
        }
      >
        <AlignRightIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
        className={
          editor?.isActive({ textAlign: "justify" })
            ? "bg-accent text-accent-foreground"
            : ""
        }
      >
        <AlignJustifyIcon className="h-4 w-4" />
      </Button>

      <div className="h-6 w-px bg-border mx-1 md:mx-2" />
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        className={
          editor?.isActive("bulletList")
            ? "bg-accent text-accent-foreground"
            : ""
        }
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        type="button"
        className={
          editor?.isActive("orderedList")
            ? "bg-accent text-accent-foreground"
            : ""
        }
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <div className="h-6 w-px bg-border mx-1 md:mx-2" />
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        type="button"
        className={
          editor?.isActive("blockquote")
            ? "bg-accent text-accent-foreground"
            : ""
        }
      >
        <QuoteIcon className="h-4 w-4" />
      </Button>
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        type="button"
        className={
          editor?.isActive("highlight")
            ? "bg-accent text-accent-foreground"
            : ""
        }
      >
        <HighlighterIcon className="h-4 w-4" />
      </Button>

      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        type="button"
        className={
          editor?.isActive("codeBlock")
            ? "bg-accent text-accent-foreground"
            : ""
        }
      >
        <Code className="h-4 w-4" />
      </Button>
      <div className="h-6 w-px bg-border mx-1 md:mx-2" />

      <Button
        variant={"outline"}
        size={"icon"}
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={
          editor?.isActive("codeBlock")
            ? "bg-accent text-accent-foreground"
            : ""
        }
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
