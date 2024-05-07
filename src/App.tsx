import { useState, useEffect } from 'react';
import './App.css';

const useImageURL = () => {
  const [imageURL, setImageURL] = useState(null); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const imageURLList = [
      "https://jsonplaceholder.typicode.com/photos/1",
      "https://jsonplaceholder.typicode.com/photos/2"
    ];

    // Utilizamos Promise.all para realizar las solicitudes en paralelo
    Promise.all(
      imageURLList.map(url =>
        fetch(url, { mode: "cors" })
          .then(response => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then(data => data.url) // Extraemos la URL de la imagen de la respuesta
          .catch(error => {
            throw new Error(`Error fetching image: ${error.message}`);
          })
      )
    )
      .then(urls => {
        // Actualizamos el estado con las URLs de las imágenes una vez que todas las solicitudes se completen
        setImageURL(urls);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        // Marcamos que la carga ha finalizado, independientemente de si fue exitosa o fallida
        setLoading(false);
      });
  }, []);

  return { imageURL, error, loading };
};

function App() {
  const { imageURL, error, loading } = useImageURL();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  return (
    <>
      <h1>Images</h1>
      {imageURL.map((url, index) => (
        <img key={index} src={url} alt={`Image ${index}`} />
      ))}
    </>
  );
}

export default App;
