import { useEffect, useState } from 'react';
import { Lora } from 'next/font/google';
import config from '../../config/backend';
import MarkdownViewer from '../../components/Markdown/viewer'


const inter = Lora({ subsets: ['latin'] });

export default function Home() {
    const [selectedText, setSelectedText] = useState('');
    const [responseExplainText, setResponseExplainText] = useState('');
    const [responseExplainStatus, setResponseExplainStatus] = useState(0);
    const [paragraph, setParagraph] = useState('');

    useEffect(() => {
        const handleMouseUp = (e) => {
            const text = window.getSelection().toString();
            setSelectedText(text);
        };

        let article = document.getElementById('article');

        article.addEventListener('mouseup', handleMouseUp);
        return () => {
            article.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    useEffect(() => {
        const fetchParagraph = async () => {
            try {
                const response = await fetch(config['backendUrl'] + '/files');
                const data = await response.json();
                setParagraph(data.file_content);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchParagraph();
    }, []);

    const getExplain = async () => {
        const url = new URL(config['backendUrl'] + "/explain");

        url.searchParams.append('sample', selectedText);
        url.searchParams.append('language', 'french');

        try {
            const response = await fetch(url);
            console.log(response.status)
            const data = await response.json();
            console.log(data);
            setResponseExplainText(data['text']);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };


    console.log("Selected: \"" + selectedText + "\"");
    let selectionDisplay = selectedText ? selectedText : "No text selected."

    return (
        <div className="flex h-screen">
            <div className={`flex-1 ${inter.className} p-8 overflow-y-auto`}>
                <div id="article" className="w-full">
                    <MarkdownViewer>{paragraph}</MarkdownViewer>
                </div>
            </div>
            <div id="sidebar" className="w-1/4 bg-gray-100 p-8">
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
                    <p>
                        {responseExplainText}
                    </p>
                </div>
            </div>
        </div>
      );
}