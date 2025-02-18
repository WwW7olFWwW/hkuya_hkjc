const API_URL = process.env.STRAPI_API_URL;

export async function fetchPositions() {
  try {
    const res = await fetch(`${API_URL}/api/positions?populate=*`);
    return await res.json();
  } catch (error) {
    console.error('CMS連接錯誤:', error);
    return [];
  }
}
