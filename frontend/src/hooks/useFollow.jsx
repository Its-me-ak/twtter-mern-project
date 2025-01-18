import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

const useFollow = () => {
    const queryClint = useQueryClient()
    const { mutate: followUser, isPending } = useMutation({
        mutationFn: async (userId) => {
            const response = await fetch(`/api/users/follow/${userId}`, {
                method: "POST",
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || "Something went wrong");
            return data;
        },
        onSuccess: () => {
            Promise.all([
                queryClint.invalidateQueries({ queryKey: ["suggestedUsers"] }),
                queryClint.invalidateQueries({ queryKey: ["authUser"] }),
                queryClint.invalidateQueries({ queryKey: ["followingUser"] })
            ])
        },
        onError: (err) => {
            toast.error(err.message)
        },
    })
    return { followUser, isPending }
}

export default useFollow;