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
import TextTruncate from 'react-text-truncate';
import { useNavigate } from "react-router-dom";
import cuid from 'cuid';

const styles = theme => ({
  hidden: {
    display : 'none',
  },
  fab: {
    position : 'fixed',
    bottom : '20px',
    right : '20px'
  }
})

function Texts(props, {setTextID, textID}) {
  console.log((setTextID, textID))

  const navigate = useNavigate();
  const { classes } = props;
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(false); //dialog 창 열때 
  
  const [fileName, setFileName] = useState(''); 
  const [fileContent, setFileContent] = useState(null);
  const [texts, setTexts] = useState({}); 
  const [textName, setTextName] = useState(''); 

  useEffect(() => {
    setLoading(true);
    onValue(child(ref(dbrt), 'texts'), (snapshot) => {
      setTexts([])
      const data = snapshot.val();
      if (data !== null) {// eslint-disable-next-line
        Object.values(data).map((text) => {
          setTexts((oldArray) => [...oldArray, text]);
        });
      }
    })
    setLoading(false)
  }, [])

  function saveTextsToFirebase (textsData) {
    const uuid = cuid()
    set(ref(dbrt, `/texts/${uuid}`), {
      id : uuid,
      textName: textsData.textName,
      fileName : textsData.fileName,
      fileContent: textsData.fileContent
    })
  }

  function handleDelete (id) {
    remove(ref(dbrt, `texts/${id}`))
  }

  function handleDialogToggle() {
    setDialog(!dialog);
    setFileName('');
    setFileContent('');
    setTextName('')
  }

  function handleValueTextNameChange(e) {
    setTextName(e.target.value)
  }

  function handleSubmit() {
    const textsData = {
      textName, fileContent, fileName
    }
    handleDialogToggle();
    saveTextsToFirebase(textsData)
  }

  function handleFileChange(e) {
    let reader = new FileReader();
    reader.onload = () => {
      let text = reader.result;
      setFileContent(text)
    }
    reader.readAsText(e.target.files[0], "UTF-8")
    setFileName(e.target.value)
  }

  function handleClick(id) {
    navigate(`/detail/${id}`)
    setTextID(id)
  }


  if(loading) {
    return <h1>Loading...</h1>;
  }



  return (
    <>
      {Object.keys(texts).map(i => {
        const text = texts[i];
        return (
          <Card key={i}>
            <CardContent>
              <Typography color='textSecondary' gutterBottom>
                내용 : {text.fileContent.substring(0,24) + '...'}
              </Typography>
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant='h5' component="h2">
                    {text.textName.substring(0,20) + '...'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Button variant='contained' color='primary' 
                    onClick={() => handleClick(text.id)}>보기</Button>
                </Grid>
                <Grid item xs={3}>
                  <Button variant='contained' color='secondary' onClick={() => handleDelete(text.id)}>삭제</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )
      })}
      <Fab color='primary' className={classes.fab} onClick={handleDialogToggle} >
        <AddIcon />
      </Fab>
      <Dialog open = {dialog} onClose={handleDialogToggle}>
        <DialogTitle>텍스트 추가</DialogTitle>
        <DialogContent>
          <TextField label='텍스트 이름' 
            type='text' 
            name='textName' 
            value={textName} 
            onChange={handleValueTextNameChange} 
          /> <br /><br />
          <input className={classes.hidden} 
            accept="text/plain" 
            id="raised-button-file" 
            type="file" 
            name = 'file'
            value={fileName}
            onChange={handleFileChange}
          />
          <label htmlFor='raised-button-file'>
            <Button variant='contained' color='primary' component="span" name="file">
              {fileName === "" ? ".txt 파일 선택" : fileName}
            </Button>
          </label>
          <TextTruncate line={1} truncateText="..." text={fileContent} />

        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='primary' onClick={handleSubmit}>추가</Button>
          <Button variant='outlined' color='primary' onClick={handleDialogToggle}>닫기</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default withStyles(styles)(Texts)