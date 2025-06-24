// src/hooks/usePostModeration.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { approvePost, rejectPost } from '@/services/post'; // Adjust path if needed

export const useBlogStatus= (actionType) => {
  const queryClient = useQueryClient();

  if (!['approve', 'reject'].includes(actionType.toLowerCase())) {
    throw new Error("Invalid actionType for useBlogStatus. Must be 'approve' or 'reject'.");
  }

  const mutationFn = actionType === 'approve' ? approvePost : rejectPost;
  const successMessage = actionType === 'approve' ? 'Post approved successfully!' : 'Post rejected successfully!';
  const errorMessage = actionType === 'approve' ? 'Failed to approve post.' : 'Failed to reject post.';

  return useMutation({
    mutationFn: (postId) => mutationFn(postId), 
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['post', variables]);

      queryClient.invalidateQueries({
        predicate:(query)=>{
            return query.queryKey.includes("posts");
        }
      })

      toast.success(successMessage);
    },
    onError: (error, variables) => {
      console.error(`Error ${actionType}ing post ${variables}:`, error);
      toast.error(errorMessage);
    },
  });
};