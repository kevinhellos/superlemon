import { HttpFetchConfig } from "@/models";

export async function HttpFetch(config: HttpFetchConfig) {
  try {
    const response = await fetch(config.url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.authorizationToken}`
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data) return data; 
    }
  } 
  catch (error) {
    console.error("[CLIENT ERROR]: HttpFetch error ", error);
  }
}