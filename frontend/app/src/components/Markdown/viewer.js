import React from 'react'
import ReactMarkdown from 'react-markdown'

const MarkdownViewer = (props) => {
  return <ReactMarkdown>{props.children}</ReactMarkdown>
}

export default MarkdownViewer
