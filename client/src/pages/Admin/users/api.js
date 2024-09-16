import axiosInstance from "../../../adminaxios";



export const getAllusers =async()=>{
try {
    const res = await axiosInstance.get()
    return res
} catch (error) {
    console.error(error.message)
}
}









// Fetch all users
export const getAllUsers = async () => {
    try {
      const res = await axiosInstance.get('/users');
      return res.data;
    } catch (error) {
      throw new Error(`Failed to load users: ${error.message}`);
    }
  };
  
  // Delete a user
  export const deleteUser = async (id) => {
    try {
      await axiosInstance.delete(`/users/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  };