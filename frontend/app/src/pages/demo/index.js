import React, { useEffect, useState } from 'react';
import { Lora } from 'next/font/google';
import config from '../../config/backend';
import MarkdownViewer from '../../components/Markdown/viewer'
import { Resizable } from 'react-resizable';
import SplitPane, { Pane } from 'react-split-pane';


const inter = Lora({ subsets: ['latin'] });

export default function Home() {
    const [selectedText, setSelectedText] = useState('');
    const [responseExplainText, setResponseExplainText] = useState('');

    // 0 = not requested, 1 = loading, 2 = complete, 3 = error
    const [responseExplainStatus, setResponseExplainStatus] = useState(0);
    const [paragraph, setParagraph] = useState('');

    const [translationsRemaining, setTranslationsRemaining] = useState(2);

    // Comprehension questions
    const [questions, setQuestions] = useState([]);
    const [questionsStatus, setQuestionsStatus] = useState(0);

    // Vocab words
    const [vocab, setVocab] = useState([]);
    const [vocabStatus, setVocabStatus] = useState(0);

    const [passageStatus, setPassageStatus] = useState(0);



    useEffect(() => {
        const handleMouseUp = (e) => {
            const text = window.getSelection().toString();
            setSelectedText(text);
        };

        let article = document.getElementById('article');
        let questions = document.getElementById('questions');


        article.addEventListener('mouseup', handleMouseUp);
        questions.addEventListener('mouseup', handleMouseUp);

        return () => {
            article.removeEventListener('mouseup', handleMouseUp);
            questions.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    useEffect(() => {
        const fetchParagraph = async () => {
            try {
                setPassageStatus(1);
                const response = await fetch(config['backendUrl'] + '/files');
                const data = await response.json();
                setParagraph(data.file_content);
                setPassageStatus(2);
            } catch (error) {
                setPassageStatus(3);
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchParagraph();
    }, []);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setQuestionsStatus(1);

                const url = new URL(config['backendUrl'] + "/comprehension");

                url.searchParams.append('sample', paragraph);
                url.searchParams.append('language', 'french');

                const response = await fetch(url);
                const data = await response.json();
                setQuestions(data['questions']);
                setQuestionsStatus(2);
            } catch (error) {
                setQuestionsStatus(3);
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        if (passageStatus == 2){
            fetchQuestions();
        }
    }, [passageStatus]);

    useEffect(() => {
        const fetchVocab = async () => {
            try {
                setVocabStatus(1);

                const url = new URL(config['backendUrl'] + "/vocab");

                url.searchParams.append('sample', paragraph);
                url.searchParams.append('language', 'french');

                const response = await fetch(url);
                const data = await response.json();
                if (data['status'] == 'success'){
                    setVocab(data['vocab']);
                    setVocabStatus(2);
                }
                else {
                    setVocabStatus(3);
                }
            } catch (error) {
                setVocabStatus(3);
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        if (passageStatus == 2){
            fetchVocab();
        }
    }, [passageStatus]);

    const getExplain = async () => {
        const url = new URL(config['backendUrl'] + "/explain");

        url.searchParams.append('sample', selectedText);
        url.searchParams.append('language', 'french');

        setResponseExplainStatus(1);

        try {
            const response = await fetch(url);
            console.log(response.status)
            const data = await response.json();
            console.log(data);
            setResponseExplainText(data['text']);
            setResponseExplainStatus(2);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setResponseExplainStatus(3);
        }
    };

    const getTranslate = async () => {
        const url = new URL(config['backendUrl'] + "/translate");

        url.searchParams.append('sample', selectedText);
        url.searchParams.append('language', 'french');

        setResponseExplainStatus(1);

        try {
            const response = await fetch(url);
            console.log(response.status)
            const data = await response.json();
            console.log(data);
            setResponseExplainText(data['text']);
            setResponseExplainStatus(2);
            setTranslationsRemaining(translationsRemaining - 1);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setResponseExplainStatus(3);
        }
    };


    let selectionDisplay = selectedText ? selectedText : "No text selected."

    let translateButton = "";
    if (translationsRemaining > 0){
        translateButton = (
            <React.Fragment>
            <br/><br/>
            <button onClick={getTranslate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Translate ({translationsRemaining} left)
            </button>
            </React.Fragment>
        )
    }

    let responseExplainTextDisplay = responseExplainText;
    console.log(responseExplainStatus)
    if (responseExplainStatus === 1){
        responseExplainTextDisplay = "Loading..."
    }
    else if (responseExplainStatus === 3){
        responseExplainTextDisplay = "Error"
    }

    function questionsMap(questionIndex){
        return (
            <p>
                {questionIndex+1}: {questions[questionIndex]}
            </p>
        )
    }

    function vocabMap(vocabIndex){
        return (
            <p>
                {vocabIndex+1}: {vocab[vocabIndex]}
            </p>
        )
    }

    let questionsText = ""
    if (questionsStatus == 1){
        questionsText = "Loading..."
    }
    else if (questionsStatus == 2){
        let is = Array.from({ length: questions.length }, (_, i) => i);
        questionsText = is.map(questionsMap);
    }

    let vocabText = ""
    if (vocabStatus == 1){
        vocabText = "Loading..."
    }
    else if (vocabStatus == 2){
        let vocabIndices = Array.from({ length: vocab.length }, (_, i) => i);
        vocabText = vocabIndices.map(vocabMap);
    }

    return (
        <div className="flex h-screen">
            <div className={`flex-1 ${inter.className} p-8 overflow-y-auto`}>
                <div id="article" className="w-full">
                    <MarkdownViewer>{paragraph}</MarkdownViewer>
                </div>
            </div>
            <div id="sidebar" className="w-1/3 bg-gray-100 p-8 allow-resize">
                <div>
                    <h1>
                        Selection
                    </h1>
                    <p>
                        {selectionDisplay}
                    </p>
                    <button onClick={getExplain} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Make Simpler
                    </button>
                    {translateButton}
                    <p>
                        {responseExplainTextDisplay}
                    </p>
                </div>
                <hr/>
                <div id="questions">
                    <h1>
                        Reading Comprehension
                    </h1>
                    {questionsText}
                </div>
                <hr/>
                <div id="vocab">
                    <h1>
                        Vocab Words
                    </h1>
                    {vocabText}
                </div>
            </div>
        </div>
      );
}