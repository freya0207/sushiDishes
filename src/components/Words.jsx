import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { db } from '../firebase';
import {collection, getDocs} from 'firebase/firestore';


function Words() {

  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);

  const wordsRef =  collection(db,'words')
  
  useEffect(() => {
    setLoading(true)
    const getWords = async () => {
      const data = await getDocs(wordsRef)
      setWords(data.docs.map((doc) => ({...doc.data(), id : doc.id})))
    }
  
    getWords()
    setLoading(false)
  }, [wordsRef])
  

  if(loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      {words.map((word) => (
        <Card key={word.id}>
          <CardContent>
            <Typography color='textSecondary' gutterBottom>
              가중치 : {word.weight}
            </Typography>
            <Typography variant='h5'component='h2'>
              {word.word}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export default Words