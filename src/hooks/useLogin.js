import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/Slices/authSlice";


export const useLogin = () => {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            dispatch(setUser(data?.user));
        }
    })
}