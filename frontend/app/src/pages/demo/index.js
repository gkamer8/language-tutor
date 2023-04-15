import { useEffect, useState } from 'react';
import { Lora } from 'next/font/google';

const inter = Lora({ subsets: ['latin'] });

export default function Home() {
    const [selectedText, setSelectedText] = useState('');

    useEffect(() => {
        const handleMouseUp = (e) => {
            const text = window.getSelection().toString();
            setSelectedText(text);
        };

        let article = document.getElementById('article-text');

        article.addEventListener('mouseup', handleMouseUp);
        return () => {
            article.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    let paragraph = `
        La Cour suprême américaine a suspendu de façon temporaire vendredi 14 avril la décision d’un tribunal d’une instance inférieure, permettant ainsi le maintien pour le moment d’un accès complet à la mifépristone, médicament utilisé pour plus de la moitié des avortements aux Etats-Unis. Cette suspension vaut jusqu’à mercredi avant minuit, a précisé la Cour suprême dans sa décision. Elle ne présage pas de sa décision future sur le dossier, dont l’issue reste très incertaine.
    `
    return (
        <div className="flex h-screen">
          <div className={`flex-1 ${inter.className} p-8 overflow-y-auto`}>
            <div id="article" className="w-full">
              <div id="article-text">{paragraph}</div>
            </div>
          </div>
          <div id="sidebar" className="w-1/4 bg-gray-100 p-8">
            {selectedText}
          </div>
        </div>
      );
}