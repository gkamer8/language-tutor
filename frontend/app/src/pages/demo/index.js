import { useEffect, useState } from 'react';
import { Lora } from 'next/font/google';
import config from '../../config/backend';
import MarkdownViewer from '../../components/Markdown/viewer'


const inter = Lora({ subsets: ['latin'] });

export default function Home() {
    const [selectedText, setSelectedText] = useState('');
    const [responseText, setResponseText] = useState('');

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

    const getExplain = async () => {
        const url = new URL(config['backendUrl'] + "/explain");

        url.searchParams.append('sample', selectedText);
        url.searchParams.append('language', 'french');

        try {
            const response = await fetch(url);
            console.log(response.status)
            const data = await response.json();
            console.log(data);
            setResponseText(data['text']);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    let paragraph = "# Hello\nMy name is **Elder John**"
    return (
        <div className="flex h-screen">
          <div className={`flex-1 ${inter.className} p-8 overflow-y-auto`}>
            <div id="article" className="w-full">
                <MarkdownViewer>{paragraph}</MarkdownViewer>
            </div>
          </div>
          <div id="sidebar" className="w-1/4 bg-gray-100 p-8">
            <div>
                {selectedText}
            </div>
            <button onClick={getExplain} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Make Simpler
            </button>
            <div>
                {responseText}
            </div>
          </div>
        </div>
      );
}