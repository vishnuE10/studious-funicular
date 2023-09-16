import React from 'react';
import dynamic from 'next/dynamic'; // Import dynamic from Next.js

const Editor = dynamic(() => import('../components/Editor'), { ssr: false });

const Home = () => {
  return (
    <main>
      <link
        rel="stylesheet"
        href="https://cdn.quilljs.com/1.0.0/quill.snow.css"
      />
      <Editor />
    </main>
  );
};

export default Home;
