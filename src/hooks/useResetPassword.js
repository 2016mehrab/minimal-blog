import { resetPassword as resetPasswordService} from "@/services/auth";
import { useMutation } from "@tanstack/react-query";

export const useResetPassword = () => {


  const {
    mutate: resetPassword, isPending:isLoading , error 
  } = useMutation({
    mutationFn:({token, newPassword})=>resetPasswordService({token, newPassword})
    ,
    onSuccess:(data)=>{
        console.log(data.message);
    },
    onError:(err)=>{
      console.error("error", err)
    }

  })
  return { resetPassword, isLoading, error };
};
