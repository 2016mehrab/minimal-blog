import React, { useEffect, useState } from "react";
import "../App.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // Used for form labels with Select

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import constants from "@/lib/constants";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
import TextEditorMenu from "./TextEditorMenu";
import { TrashIcon, X } from "lucide-react";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { toast } from "sonner";
import { useNavigate } from "react-router";

let PostStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  PENDING: "PENDING",
};

const PostForm = ({
  onDelete,
  isDeleting,
  initialPost,
  onSubmit,
  onCancel,
  categories,
  availableTags,
  role,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState(initialPost?.title || "");
  const [categoryId, setCategoryId] = useState(initialPost?.category?.id || "");
  const [selectedTags, setSelectedTags] = useState(initialPost?.tags || []);
  const [status, setStatus] = useState(initialPost?.status || PostStatus.DRAFT);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const lowlight = createLowlight(all);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Subscript,
      Superscript,
      Underline,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],

    content: initialPost?.content || "",
    editorProps: {
      attributes: {
        class:
          "h-full  overflow-y-scroll prose max-w-none focus:outline-none  p-2 md:p-4 border border-input rounded-md",
      },
    },
    onUpdate: () => {
      setErrors((prev) => ({ ...prev, content: "" }));
    },
  });

  const [currentSelectTagValue, setCurrentSelectTagValue] = useState("");
  console.log("role from PostForm", role)

  useEffect(() => {
    console.info("Use effect in effect");
    if (initialPost && editor) {
      setTitle(initialPost.title);
      console.info("content", initialPost.content);
      editor.commands.setContent(initialPost.content);
      setCategoryId(initialPost.category?.id);
      setSelectedTags(initialPost.tags);
      setStatus(initialPost.status || PostStatus.DRAFT);
    }
  }, [initialPost, editor]);

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!editor?.getHTML() || editor?.getHTML() === "<p></p>") {
      newErrors.content = "Content is required";
    }
    if (!categoryId) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = async () => {
    try {
      await onDelete();
      toast.success("Blog deleted");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const postData = {
      title: title.trim(),
      content: editor?.getHTML() || "",
      categoryId: categoryId,
      tagIds: selectedTags.map((tag) => tag.id),
      status,
    };
    console.log("submitted post", postData);

    try {
      await onSubmit(postData); 
      navigate("/home");

    } catch (error) {
      console.error("Submission error:", error);
      if (error?.error) {
        if (error.error.fieldErrors) {
          setErrors((prev) => ({
            ...prev,
            ...error.error.fieldErrors,
          }));
        }
      }
    }
  };

  const handleTagAdd = (tag) => {
    if (
      tag &&
      !selectedTags.some((t) => t.id === tag.id) &&
      selectedTags.length < constants.MAX_TAGS_ALLOWED
    ) {
      setSelectedTags([...selectedTags, tag]);
      setCurrentSelectTagValue("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagToRemove.id));
  };

  function handleCategorySelect(categoryId) {
    setCategoryId(categoryId);
    setErrors((prev) => ({ ...prev, category: "" }));
    console.info("category selected", categoryId);
  }
  function handleTitle(e) {
    setTitle(e.target.value);
    setErrors((prev) => ({ ...prev, title: "" }));
  }

  const suggestedTags = (availableTags || []).filter(
    (tag) => !selectedTags.some((t) => t.id === tag.id)
  );

  const isEditorOrAdmin = role?.includes("ROLE_ADMIN") || role?.includes("ROLE_EDITOR");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className={""}>
        <CardContent className="space-y-4 pt-6 ">
          <div className="space-y-2 px-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitle}
              className={errors.title ? "border-red-500" : ""}
              required
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className=" space-y-2 md:space-y-3 h-[600px] md:h-[800px]  flex flex-col p-2">
            <TextEditorMenu editor={editor} />
            <EditorContent className="flex-grow min-h-0" editor={editor} />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          <div className="space-y-2 px-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={handleCategorySelect}>
              <SelectTrigger
                className={errors.category ? "border-red-500" : ""}
                id="category"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2  px-2">
            <Label>Tags</Label>
            <Select
              value={currentSelectTagValue}
              onValueChange={(tagId) => {
                const tag = availableTags.find((t) => t.id === tagId);
                if (tag) handleTagAdd(tag);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Add Tags" />
              </SelectTrigger>
              <SelectContent>
                {suggestedTags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map((tag) => (
                <Button
                  variant={"destructive"}
                  size={"sm"}
                  onClick={() => handleTagRemove(tag)}
                  key={tag.id}
                >
                  {tag.name}
                  <X size={2} />
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2 px-2 ">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PostStatus.DRAFT}>Draft</SelectItem>
                <SelectItem value={PostStatus.PENDING}>
                  {!isEditorOrAdmin ? `Request Publication` : `Pending`}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4  ">
            {initialPost && (
              <Button
                variant="destructive"
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <TrashIcon className="" /> Delete
              </Button>
            )}
            <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {initialPost ? "Update" : "Create"} Post
              {isSubmitting && <span className="ml-2 animate-spin">⚙️</span>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default PostForm;
