// utils/finalizePrompt.js

import { DB } from "./firebase";
import axios from 'axios';
import { collection, getDocs, query, where } from 'firebase/firestore';

const queryNotesByTag = async (tag) => {
  try {
    const notesCollection = collection(DB, 'notes');
    const notesQuery = query(notesCollection, where('marker', '==', tag));
    const querySnapshot = await getDocs(notesQuery);

    const notes = [];
    querySnapshot.forEach((doc) => {
      notes.push(doc.data().summary);
      //console.log(doc.data())
    });

    return notes;
  } catch (error) {
    console.error('Error querying notes: ', error);
    return [];
  }
};

const finalizePrompt = async (message) => {
  try {
    const objectDesc = {
      'Crane': 'These notes are familiar to the user, and they represent educational depth. The user understands these concepts but cannot apply their analogies to other things and they should be brought up straightforwardly: \n',
      'Ox': 'These ideas make up a strong foundation of the users knowledge structure. The user can relate these ideas to unfamiliar concepts, and difficult leaps in logic can be understood. These ideas should be repeated when necessary to encourage analogy learning: \n',
      'Tiger': 'These ideas are unfamiliar to the user, but they feel as though they could grasp them. Please try to explain these concepts in many ways, regardless of how familiar they are with the other concepts. The user is willing to learn and will do anything to do so: \n',
      'Mouse': 'The user is fearful of these ideas. Their contents should be introduced slowly to the user and you should try to ensure that the user understands fully before moving on. These ideas might be slippery and tricky for the user so be patient with them as they learn them: \n',
      'Rabbit': 'These notes are purely creative for the user. They should represent the creative and generative capacity for the user. The user has the capacity to generate these ideas, so you may use their creative capacity as a basis for their other notes: \n'
    };

    const animalarray = {
      "Crane": [],
      "Ox": [],
      "Tiger": [],
      "Rabbit": [],
      "Mouse": []
    };

    let prompt = "Answer the prompt as if you were speaking to the user.You will learn about the knowledge structure of the user. Based on this, try to construct a reasonable way to respond to the request of the user outlined as the last task. You may adjust the formality accordingly, based on how many notes they are familiar with or not. Ultimately, do not exceed a paragraph in length, or 300 words.\n";
    const tags = Object.keys(animalarray);

    for (const tag of tags) {
      const notes = await queryNotesByTag(tag);
      animalarray[tag] = notes;
    }

    for (const anim in animalarray) {
      if (animalarray[anim].length) {
        prompt += `${objectDesc[anim]}, ${animalarray[anim]}\n`;
      }
    }
    prompt += '\n'
    prompt += message;
    console.log(prompt)
    
    const res = await axios.post('/api/core/chatgpt', { prompt });
    const summary = res.data.response.choices[0].message.content;
    return summary;
  } catch (error) {
    console.error('Error in finalizePrompt:', error);
    throw new Error('Error finalizing prompt');
  }
};

export { finalizePrompt };
