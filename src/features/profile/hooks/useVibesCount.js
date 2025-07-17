// import { useState, useEffect } from "react";

// export function useVibesCount(jwt) {
//   const [vibesCount, setVibesCount] = useState(0);

//   useEffect(() => {
//     if (!jwt) return;

//     let isMounted = true;

//     fetch("/api/v3/vibes", {
//       headers: {
//         Authorization: `Bearer ${jwt}`,
//         "Content-Type": "application/json",
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (isMounted) {
//           setVibesCount(Array.isArray(data) ? data.length : 0);
//         }
//       })
//       .catch(() => {
//         if (isMounted) {
//           setVibesCount(0);
//         }
//       });

//     return () => {
//       isMounted = false;
//     };
//   }, [jwt]);

//   return vibesCount;
// }

export function useVibesCount(jwt) {
  return 0;
}

