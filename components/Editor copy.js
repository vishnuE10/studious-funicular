import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import Paper from '@mui/material/Paper';
import FeatherIcon from 'feather-icons-react';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import fuzzball from 'fuzzball';

const Editor = () => {
  const editorRef = useRef(null);
  let quill;
  const predefinedTitles = [
    'Chief complaint & Present illness',
    'General Examination',
    'Systemic Examination',
    'Medical History:',
    'Past History:',
    'Personal History:',
  ]; // Add your predefined titles here

  useEffect(() => {
    if (editorRef.current) {
      quill = new Quill(editorRef.current, {
        theme: 'bubble',
        modules: {
          toolbar: [
            [{ header: '1' }, { header: '2' }],
            ['bold', 'italic', 'underline', 'strike'],
            ['link', 'image'],
          ],
        },
      });

      const customButton = document.getElementById('custom-header-button');

      if (customButton) {
        customButton.addEventListener('click', () => {
          const selection = quill.getSelection();
          if (selection) {
            const headerFormat = quill.getFormat(selection.index, selection.length);
            if (headerFormat && headerFormat.header && headerFormat.header === '1') {
              quill.format('header', false);
            } else {
              quill.format('color', '#2F80ED');
              quill.format('header', '2');
            }

            // Start listening to text changes after the custom button is clicked
            quill.on('text-change', (delta, oldDelta, source) => {
              if (source === 'user') {
                const lines = quill.getLines(); // Get all the lines in the editor
                const lastLine = lines[lines.length - 1]; // Get the last line
            
                // Extract the text from the last line
                const lastLineText = quill.getText(lastLine.index, lastLine.length);
                
                const lastWord = lastLineText.split(' ').pop();
            
                // Perform a fuzzy string match to find the closest matching predefined title
                const matchedTitle = fuzzyMatchLastWord(lastWord, predefinedTitles);
            
                if (matchedTitle) {
                  const range = quill.getSelection();
                  if (range) {
                    quill.deleteText(range.index - lastWord.length, lastWord.length); // Remove the matched text
                    quill.insertText(
                      range.index,
                      matchedTitle,
                      { header: '1', font: 'Roboto', color: '#8F91AA' }
                    ); // Insert the matched title with the desired format // Insert the matched title with the desired format
                  }
                }
              }
            });
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    if (quill) {
      // Set the initial content to an <h1> with the desired color as a placeholder
      quill.setText('Final diagnosis...\n', 'api');
      quill.format('header', '1');
      quill.formatText(0, 18, {
        bold: false,
        color: '#8F91AA',
        font: 'Roboto',
      });

      // Clear the editor content when it's focused for user input
      quill.on('editor-change', (eventName, ...args) => {
        if (eventName === 'selection-change') {
          const [range] = args;
          if (range) {
            const text = quill.getText(range.index, range.length);
            if (text === 'Final diagnosis...') {
              quill.deleteText(range.index, range.length);
            }
          }
        }
      });
    }
  }, []);
 
  function fuzzyMatchLastWord(lastWord, predefinedTitles) {
    let bestMatch = null;
    let bestScore = 0;
  
    for (const title of predefinedTitles) {
      const score = fuzzball.partial_ratio(lastWord.toLowerCase(), title.toLowerCase());
      if (score > bestScore) {
        bestMatch = title;
        bestScore = score;
      }
    }
  
    if (bestScore >= 80) {
      return bestMatch;
    }
  
    return null;
  }
  
  return (
    <div>
      <div id="editor" ref={editorRef} style={{height:'100vh'}}/>
      <Box sx={{alignItems:'center', display: 'flex',justifyContent: 'center',p:0}}>
      <Paper elevation={0} sx={{px:"1rem",backgroundColor:'#F6F6F6' ,width:'auto', alignItems:'center', display: 'flex',justifyContent: 'center',borderRadius:'10px',position: 'fixed', bottom: '2rem',zIndex:'1100'}}>
      <IconButton id="custom-header-button" aria-label="heading">
      <Typography sx={{fontSize:'24px',fontWeight:'600',color:'#272838',px:'0.5rem'}}>H</Typography>
      </IconButton>
      <IconButton aria-label="delete" sx={{p:'1rem'}}>
      <FeatherIcon icon='paperclip' color='#272838' />
      </IconButton>
      <IconButton aria-label="delete" sx={{p:'1rem'}}>
      <FeatherIcon icon='image' color='#272838' />
      </IconButton>
      <IconButton aria-label="delete" sx={{p:'1rem'}}>
      <FeatherIcon icon='edit-3' color='#272838' />
      </IconButton>
      <IconButton aria-label="delete" sx={{p:'1rem'}}>
      <FeatherIcon icon='zap' color='#272838'/>
      </IconButton>
      <IconButton aria-label="delete" sx={{p:'1rem'}}>
      <FeatherIcon icon='file-text' color='#272838' />
      </IconButton>
      <IconButton aria-label="delete" sx={{p:'1rem'}}>
      <FeatherIcon icon='share-2' color='#272838' />
      </IconButton>
      </Paper>
      </Box>
    </div>
  );
};

export default Editor;
