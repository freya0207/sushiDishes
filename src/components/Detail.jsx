import React, { useEffect, useState } from 'react';
import {ref, onValue, child} from 'firebase/database';
import { dbrt } from '../firebase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import UpdateIcon from '@material-ui/icons/Update';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useParams } from 'react-router-dom';
import { DialogContent, TextField } from '@material-ui/core';

const apiURL = 'http://localhost:5000';

const styles = theme => ({
  fab: {
    position : 'fixed',
    bottom : '20px',
    right : '20px'
  }
})

function Detail(props) {

  const {textID} = useParams()
  const { classes } = props;
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(false); //dialog 창 열때 
  const [textContent, setTextContent] = useState('');
  const [maxCount, setMaxCount] = useState('');
  const [minLength, setMinLength] = useState('');

  const [words, setWords] = useState({}); 
  const [imageURL, setImageURL] = useState(null); 

  useEffect(() => {
    setLoading(true);
    onValue(ref(dbrt, 'texts/' + textID), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
          setTextContent(data.fileContent);
      }
    })
    setLoading(false)
  }, [textID])

  useEffect(() => {
    setLoading(true);
    onValue(child(ref(dbrt), 'words'), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
          setWords(data);
      }
    })
    setLoading(false)
  }, [])

  useEffect(() => {
    setLoading(true);
    fetch(`${apiURL}/validate?textID=${textID}`).then(res=>{
      if(res.status !== 200) {
        throw new Error(res.statusText)
      }
      return res.json();
    }).then(data => {
      if(data['result'] === true) {
        setImageURL({imageURL: apiURL + "/outputs?textID=" + textID})
      } else {
        setImageURL({imageURL: "NONE"})
      }
    })
    setLoading(false)
  }, [textID])



  function handleDialogToggle() {
    setDialog(!dialog);
  }

  const makeWordCloud = (wordCloud) => {
    fetch(`${apiURL}/process`, {
      method: 'POST',
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(wordCloud)
    }).then(res=>{
      if(res.status !== 200) {
        throw new Error(res.statusText)
      }
      return res.json();
    }).then(data => {
        console.log(data)
        setImageURL({imageURL: apiURL + "/outputs?textID=" + textID})
      }
    )
  }
  
  function handleSubmit() {
    setImageURL({imageURL: 'READY'});

    const wordCloud = {
      textID: textID,
      text: textContent,
      maxCount: maxCount,
      minLength: minLength,
      words: words
    }

    handleDialogToggle();

    if (!wordCloud.textID ||
      !wordCloud?.text ||
      !wordCloud.maxCount ||
      !wordCloud.minLength ||
      !wordCloud?.words) {
        return;
      }
    makeWordCloud(wordCloud)
  }

  const handleMaxCountChange = (e) => {
    if(e.target.value % 1 === 0) {
        if(e.target.value < 1) {
            setMaxCount(1);
        } else {
            setMaxCount(e.target.value)
        }
    }
  }

  const handleMinLengthChange = (e) => {
    if(e.target.value % 1 === 0) {
        if(e.target.value < 1) {
            setMinLength(1);
        } else {
            setMinLength(e.target.value)
        }
    }
  }

  if(loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Card>
        <CardContent>
          {
            (imageURL?.imageURL)?
                ((imageURL?.imageURL === 'READY')?
                    '워드 클라우드 이미지를 불러오고 있습니다.':
                    ((imageURL?.imageURL === 'NONE')?
                        '해당 텍스트에 대한 워드 클라우드를 만들어 주세요.':
                        <img alt='' key={Math.random()} src={imageURL?.imageURL + '&random=' + Math.random()} style={{width: '100%'}}/>)):
            ''
          }
        </CardContent>
      </Card>
      <Fab color='primary' className={classes.fab} onClick={handleDialogToggle} >
        <UpdateIcon />
      </Fab>
      <Dialog open = {dialog} onClose={handleDialogToggle}>
        <DialogTitle>위드클리우드 생성</DialogTitle>
          <DialogContent>
            <TextField label="최대 단어 개수" type="number" name="maxCount" value={maxCount} onChange={handleMaxCountChange} /><br/>
            <TextField label="최소 단어 길이" type="number" name="minLength" value={minLength} onChange={handleMinLengthChange} /><br/>
          </DialogContent>
        <DialogActions>
          <Button variant='contained' color='primary' onClick={() => handleSubmit()}>
            {imageURL?.imageURL === 'NONE' ? "만들기" : "다시 만들기"}
          </Button>
          <Button variant='outlined' color='primary' onClick={handleDialogToggle}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
      
    </>
  )
}

export default withStyles(styles)(Detail)