import clientAxios from "./axios";

export async function getTags() {
  const { data } = await clientAxios.get("/account/tags/");

  return data;
}

export async function getTagsByFilter(query) {
  const { data } = await clientAxios.get("/account/tags/?q=" + query);

  return data;
}

export async function createTag(tagName) {
  const { data } = await clientAxios.post("/account/tags/", { name: tagName });

  return data.data;
}
