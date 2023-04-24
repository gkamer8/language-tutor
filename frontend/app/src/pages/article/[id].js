import React, { useEffect, useState } from 'react';
import config from '../../config/backend';
import MarkdownViewer from '../../components/Markdown/viewer'
import Link from 'next/link'
import { useRouter } from 'next/router';


export default function Article() {

    const router = useRouter();
    const { id } = router.query;

    const MAX_SELECTION = 1250;  // characters
    const MIN_SELECTION = 3; // characters

    const [selectedText, setSelectedText] = useState('');
    const [responseExplainText, setResponseExplainText] = useState('');

    // 0 = not requested, 1 = loading, 2 = complete, 3 = error
    const [responseExplainStatus, setResponseExplainStatus] = useState(0);
    const [responseExplainError, setResponseExplainError] = useState('');
    const [paragraph, setParagraph] = useState('');
    const [language, setLanguage] = useState('');

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

        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    useEffect(() => {
        const fetchParagraph = async () => {
            try {
                setPassageStatus(1);
                const url = new URL(config['backendUrl'] + "/files");

                url.searchParams.append('id', id);

                const response = await fetch(url);
                const data = await response.json();
                setParagraph(data.file_content);
                setLanguage(data.language);
                setPassageStatus(2);
            } catch (error) {
                setPassageStatus(3);
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        if (id){
            fetchParagraph();
        }
    }, [id]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setQuestionsStatus(1);

                const url = new URL(config['backendUrl'] + "/comprehension");

                url.searchParams.append('sample', paragraph);
                url.searchParams.append('language', language);

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
                url.searchParams.append('language', language);

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


    // returns nothing if no error, otherwise returns error string
    function detectBadInput(){
        if (selectedText.length > MAX_SELECTION){
            return "Selected text too large.";
        }
        else if (selectedText.length < MIN_SELECTION){
            return "Not enough text selected.";
        }

        if (responseExplainStatus == 1){
            // Button already clicked and response loading
            return "Loading...";
        }
    }

    const getExplain = async () => {

        let bad = detectBadInput();
        if (bad){
            setResponseExplainError(bad);
            setResponseExplainStatus(3);
            return;
        }

        setResponseExplainStatus(1);

        const url = new URL(config['backendUrl'] + "/explain");

        url.searchParams.append('sample', selectedText);
        url.searchParams.append('language', language);

        try {
            const response = await fetch(url);
            console.log(response.status)
            const data = await response.json();
            setResponseExplainText(data['text']);
            setResponseExplainStatus(2);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setResponseExplainError("Could not retrieve data from server.");
            setResponseExplainStatus(3);
        }
    };

    const getTranslate = async () => {

        let bad = detectBadInput();
        if (bad){
            setResponseExplainError(bad);
            setResponseExplainStatus(3);
            return;
        }
        
        const url = new URL(config['backendUrl'] + "/translate");
        url.searchParams.append('sample', selectedText);
        url.searchParams.append('language', language);

        setResponseExplainStatus(1);

        try {
            const response = await fetch(url);
            console.log(response.status)
            const data = await response.json();
            setResponseExplainText(data['text']);
            setResponseExplainStatus(2);
            setTranslationsRemaining(translationsRemaining - 1);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setResponseExplainError("Could not retrieve data from server.");
            setResponseExplainStatus(3);
        }
    };

    const getPresentTense = async () => {

        let bad = detectBadInput();
        if (bad){
            setResponseExplainError(bad);
            setResponseExplainStatus(3);
            return;
        }
        
        const url = new URL(config['backendUrl'] + "/convert-tense");
        url.searchParams.append('sample', selectedText);
        url.searchParams.append('language', language);
        url.searchParams.append('to_tense', 'present');

        setResponseExplainStatus(1);

        try {
            const response = await fetch(url);
            console.log(response.status)
            const data = await response.json();
            setResponseExplainText(data['text']);
            setResponseExplainStatus(2);
            setTranslationsRemaining(translationsRemaining - 1);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setResponseExplainError("Could not retrieve data from server.");
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
        responseExplainTextDisplay = "Error: " + responseExplainError;
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
            <div className={`flex-1 p-8 overflow-y-auto`}>
                <style>{`
                    ::selection {
                        background-color: #ffff00;
                    }
                `}</style>
                <div>
                    <Link href="/">
                        <button type="button" className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded`}>
                            Back
                        </button>
                    </Link>
                </div>
                <div id="article" className="w-full">
                    <MarkdownViewer>{paragraph}</MarkdownViewer>
                </div>
            </div>
            <div id="sidebar" className="w-1/3 bg-gray-100 p-8 allow-resize overflow-y-auto">
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
                    <br/><br/>
                    <button onClick={getPresentTense} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Make Present Tense
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