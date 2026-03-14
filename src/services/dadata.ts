// export async function findCompanyByInn(inn: string) {
//   try {
//     const response = await fetch(
//       "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party",
//       {
//         method: "POST",
//         mode: "cors",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: "Token " + process.env.NEXT_PUBLIC_DADATA_API_KEY,
//         },
//         body: JSON.stringify({ query: inn }),
//       },
//     );

//     if (!response.ok) {
//       console.error("Dadata API error:", response.statusText);
//       return null;
//     }

//     const result = await response.json();

//     if (result && result.suggestions && result.suggestions.length > 0) {
//       return result.suggestions[0];
//     }

//     return null;
//   } catch (error) {
//     console.error("Network error in findCompanyByInn:", error);
//     return null;
//   }
// }

const BASE_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs";
const AUTH_HEADER = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: "Token " + process.env.NEXT_PUBLIC_DADATA_API_KEY,
};

/**
 * Поиск компании по ИНН
 */
export async function findCompanyByInn(inn: string) {
  try {
    const response = await fetch(`${BASE_URL}/findById/party`, {
      method: "POST",
      mode: "cors",
      headers: AUTH_HEADER,
      body: JSON.stringify({ query: inn }),
    });

    if (!response.ok) return null;
    const result = await response.json();
    return result.suggestions?.[0] || null;
  } catch (error) {
    console.error("Dadata API error (Company):", error);
    return null;
  }
}

/**
 * Подсказки по адресам
 * Используется для автодополнения адреса регистрации
 */
export async function suggestAddress(query: string) {
  try {
    const response = await fetch(`${BASE_URL}/suggest/address`, {
      method: "POST",
      mode: "cors",
      headers: AUTH_HEADER,
      body: JSON.stringify({ query, count: 5 }),
    });

    if (!response.ok) return [];
    const result = await response.json();
    return result.suggestions || [];
  } catch (error) {
    console.error("Dadata API error (Address):", error);
    return [];
  }
}

/**
 * Подсказки по отделениям ФМС / МВД
 * Помогает заполнить "Кем выдан паспорт" по коду подразделения
 */
export async function suggestFmsUnit(query: string) {
  try {
    const response = await fetch(`${BASE_URL}/suggest/fms_unit`, {
      method: "POST",
      mode: "cors",
      headers: AUTH_HEADER,
      body: JSON.stringify({ query, count: 5 }),
    });

    if (!response.ok) return [];
    const result = await response.json();
    return result.suggestions || [];
  } catch (error) {
    console.error("Dadata API error (FMS):", error);
    return [];
  }
}

// подсказки к ФИО
export const suggestFio = async (query: string, parts?: string[]) => {
  const response = await fetch(`${BASE_URL}/suggest/fio`, {
    method: "POST",
    headers: AUTH_HEADER,
    body: JSON.stringify({
      query,
      count: 5,
      parts: parts,
    }),
  });
  const data = await response.json();
  return data.suggestions;
};
