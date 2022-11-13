import React, { useEffect, useState } from 'react';
import {ref, onValue, remove, set, child} from 'firebase/database';
import { dbrt } from '../firebase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import cuid from 'cuid';

const styles = theme => ({
  fab: {
    position : 'fixed',
    bottom : '20px',
    right : '20px'
  }
})

function Words(props) {
  const { classes } = props;

  const [words, setWords] = useState({}); //db에서 가져올때
  const [loading, setLoading] = useState(false);

  const [dialog, setDialog] = useState(false); //dialog 창 열때 
  const [word, setWord] = useState(''); //db로 단어 보낼때
  const [weight, setWeight] = useState(''); //db로 가중치 보낼때

// realtime DATABASE 가져올때
  useEffect(() => {
    setLoading(true);
    onValue(child(ref(dbrt), 'words'), (snapshot) => {
      setWords([])
      const data = snapshot.val();
      if (data !== null) {// eslint-disable-next-line
        Object.values(data).map((word) => {
          setWords((oldArray) => [...oldArray, word]);
        });
      }
    })
    setLoading(false)
  }, [])


  function handleDelete (id) {
    remove(ref(dbrt, `words/${id}`))
  }

  function handleDialogToggle() {
    setDialog(!dialog);
    setWord([])
    setWeight([])
  }

  function handleValueWordChange(e) {
    setWord(e.target.value)
  }
  function handleValueWeightChange(e) {
    setWeight(e.target.value)
    if(e.target.value < 1) {
      setWeight(1);
    }
    else if(e.target.value > 9) {
        setWeight(9);
    }
  }

  function saveWordToFirebase (wordData) {
    const uuid = cuid()
    set(ref(dbrt, `/words/${uuid}`), {
      id : uuid,
      word : wordData.word,
      weight: wordData.weight
    })
  }

  function handleSubmit() {
    const wordData = {
      word, weight
    }
    handleDialogToggle();
    if (!wordData.word || !wordData.weight) {
      alert('항목을 모두 입력하세요.')
    }
    saveWordToFirebase(wordData)
 
  }

  if(loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      {Object.keys(words).map((i) => {
        const word = words[i]
        return (
        <Card key={i}>
          <CardContent>
            <Typography color='textSecondary' gutterBottom>
              가중치 : {word.weight}
            </Typography>
            <Grid container>
              <Grid item xs={6}>
                <Typography variant='h5'component='h2'>
                  {word.word}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Button variant='contained' color='primary' onClick={() => handleDelete(word.id)}>
                  삭제
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )})}
      <Fab color='primary' className={classes.fab} onClick={handleDialogToggle} >
        <AddIcon />
      </Fab>
      <Dialog open = {dialog} onClose={handleDialogToggle}>
        <DialogTitle>단어추가</DialogTitle>
        <DialogContent>
          <TextField label='단어' type='text' name='word' value={word} onChange={handleValueWordChange} /> <br />
          <TextField label='가중치' type='number' name='weight' value={weight} onChange={handleValueWeightChange} /> <br />
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='primary' onClick={handleSubmit}>추가</Button>
          <Button variant='outlined' color='primary' onClick={handleDialogToggle}>닫기</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default withStyles(styles)(Words)