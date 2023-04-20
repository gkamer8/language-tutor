import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import config from '../config/backend';

export default function Examples() {

    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const url = new URL(config['backendUrl'] + "/manifest");
                const response = await fetch(url);
                const data = await response.json();
                setArticles(data.articles);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchArticles();
    }, []);
    

    const getGradientColors = (language) => {
        switch (language) {
          case 'french':
            return ['from-blue-400 to-red-200']
          case 'spanish':
            return ['from-yellow-300 to-red-600']
          case 'german':
            return ['from-green-400 to-blue-500']
        case 'italian':
            return ['from-green-400 to-red-500']
          default:
            return ['from-green-400 to-blue-500']
        }
      }
  
    return (
        <div>
            <div className="flex flex-col justify-center items-center p-4">
                <h1 className="text-5xl font-bold mb-4 p-12">Example Articles</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-screen-lg">
                {articles.map((article, index) => (
                <Link href={`/article/${article.id}`}>
                    <div
                        key={index}
                        className={`bg-gradient-to-br ${getGradientColors(article.language) } h-full p-4 rounded-lg text-white`}
                    >
                        <h2 className="text-lg font-medium mb-2">{article.title}</h2>
                        <p className="text-sm font-light">{article.language.charAt(0).toUpperCase() + article.language.slice(1)}</p>
                    </div>
                </Link>
                ))}
                </div>
            </div>
        </div>
      )
}

  