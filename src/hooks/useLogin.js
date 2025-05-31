import { login } from "@/services/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useLocalStorage } from "./useLocalStorage";

export const useLogin = () => {

  const queryClient = useQueryClient();
  const navigate =useNavigate();
  const  [_,setToken] = useLocalStorage(null, 'auth');

  const {
    mutate:loginUser, isPending:isLoading , error, data:authData
  } = useMutation({
    mutationFn:({email, password})=>login({email,password})
    ,
    onSuccess:(rawAuthData)=>{
      setToken(rawAuthData.data);
      queryClient.setQueryData(['user'], rawAuthData.data);
      navigate("/home", {replace:true});
    },
    onError:(err)=>{
      console.error("error", err)
    }

  })
  return { loginUser, isLoading, error, authData };
};
