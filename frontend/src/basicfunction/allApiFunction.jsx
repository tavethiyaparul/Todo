import axios from "axios";

export const Get_All = async (url) => {
  try {
    let response;

    response = await axios.get(url);

    return Promise.resolve(response.data);
  } catch (error) {
    console.log("Get_All error : ", error?.response?.data?.message);
    return Promise.reject(error?.response?.data?.message);
  }
};

export const Post_All = async (url, data) => {
  try {
    console.log("Post_All calling url", url, data);
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        withCredentials: true,
      },
    });
    return Promise.resolve(response.data);
  } catch (error) {
    console.log("Post_All error : ", error);
    return Promise.reject(error);
  }
};

export const Delete_All = async (url) => {
  try {
    // const token = await getSessionToken(app);
    console.log("Delete_All calling url :", url);

    const response = await axios.delete(url);
    console.log("Delete_All called....", response.data);
    return Promise.resolve(response.data);
  } catch (error) {
    console.log("Delete_All error : ", error);
    return Promise.reject(error);
  }
};
